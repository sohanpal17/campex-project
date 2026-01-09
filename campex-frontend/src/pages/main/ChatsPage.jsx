import { MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { messageService } from '@/services/message.service';
import { generateRoute } from '@/constants/routes';
import { formatTimeAgo } from '@/utils/formatters';
import { handleError, handleSuccess } from '@/utils/errorHandler';

const ChatsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Delete conversation mutation
  const deleteMutation = useMutation({
    mutationFn: messageService.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      handleSuccess('Conversation deleted');
    },
    onError: (error) => {
      handleError(error, 'Failed to delete conversation');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow-sm">
          {conversations.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-6">
                Start a conversation by messaging a seller
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center hover:bg-gray-50">
                  <button
                    onClick={() => navigate(generateRoute.chatDetail(conversation.id))}
                    className="flex-1 p-4 flex items-start gap-4 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {conversation.otherUser?.fullName?.charAt(0) || 'U'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.otherUser?.fullName || 'User'}
                        </h3>
                        <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                          {conversation.lastMessageAt
                            ? formatTimeAgo(conversation.lastMessageAt)
                            : 'Just now'}
                        </span>
                      </div>

                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>

                    {/* Unread badge */}
                    {!conversation.isLastMessageRead &&
                      conversation.lastMessageSenderId !== conversation.otherUser?.id && (
                        <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this conversation? This cannot be undone.')) {
                        deleteMutation.mutate(conversation.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
                    title="Delete conversation"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;