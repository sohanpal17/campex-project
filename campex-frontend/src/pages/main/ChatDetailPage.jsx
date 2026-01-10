import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { messageService } from '@/services/message.service';
import { userService } from '@/services/user.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { useAuth } from '@/context/AuthContext';

const ChatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages for this conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => messageService.getMessages(id, 0, 50),
    refetchInterval: 3000, // Refresh every 3 seconds for new messages
  });

  // Fetch ALL conversations to get the specific one
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
  });

  const conversation = conversations?.find(c => c.id === parseInt(id));
  const messages = messagesData?.content || [];
  const isLoading = messagesLoading || conversationsLoading;

  const sendMutation = useMutation({
    mutationFn: (content) => {
      const targetReceiverId = getReceiverId();
      return messageService.sendMessage({
        receiverId: targetReceiverId,
        productId: conversation?.product?.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', id]);
      queryClient.invalidateQueries(['conversations']);
      setMessage('');
    },
    onError: (error) => {
      handleError(error, 'Failed to send message');
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const targetReceiverId = getReceiverId();
    if (!targetReceiverId) {
      handleError(null, 'Cannot send message - recipient unknown');
      return;
    }

    sendMutation.mutate(message.trim());
  };

  // Block/Unblock mutation
  const blockMutation = useMutation({
    mutationFn: (isBlocked) =>
      isBlocked
        ? userService.unblockUser(receiverId)
        : userService.blockUser(receiverId),
    onSuccess: (_, isBlocked) => {
      handleSuccess(isBlocked ? 'User unblocked' : 'User blocked');
      setShowMenu(false);
    },
    onError: (error) => {
      handleError(error, 'Failed to update block status');
    },
  });

  // Check if user is blocked (would need backend endpoint)
  const isBlocked = false; // TODO: Fetch from backend

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Only wait for messages to load, conversation is optional
  if (messagesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Fallback values if conversation not in list yet (e.g., just created/deleted)
  const otherUserName = conversation?.otherUser?.fullName || 'User';
  const otherUserInitial = otherUserName.charAt(0);
  const productTitle = conversation?.product?.title;
  const receiverId = conversation?.otherUser?.id;
  const productId = conversation?.product?.id;

  // Get receiverId from conversation or from first message if conversation not loaded
  const getReceiverId = () => {
    if (receiverId) return receiverId;
    if (messages.length > 0) {
      const firstMsg = messages[0];
      return firstMsg.senderId === userProfile?.id ? firstMsg.receiverId : firstMsg.senderId;
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              {otherUserInitial}
            </div>
            <div>
              <div className="font-medium">{otherUserName}</div>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              <button
                onClick={() => blockMutation.mutate(isBlocked)}
                disabled={blockMutation.isPending}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {isBlocked ? (
                  <>
                    <CheckCircle size={18} />
                    Unblock User
                  </>
                ) : (
                  <>
                    <Ban size={18} />
                    Block User
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.slice().reverse().map((msg) => {
              const isOwn = msg.senderId === userProfile?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${isOwn
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-200'
                      }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                      {msg.createdAt 
                        ? (() => {
                            try {
                              const dateStr = typeof msg.createdAt === 'string' && !msg.createdAt.includes('Z') && !msg.createdAt.includes('+') && !msg.createdAt.includes('-', 10)
                                ? msg.createdAt + 'Z'
                                : msg.createdAt;
                              return new Date(dateStr).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              });
                            } catch {
                              return '';
                            }
                          })()
                        : ''}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            disabled={sendMutation.isPending}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMutation.isPending}
            className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPage;