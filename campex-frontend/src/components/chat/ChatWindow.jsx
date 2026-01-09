import { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, AlertTriangle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Avatar from '@/components/common/Avatar';

const ChatWindow = ({ conversation, messages, currentUserId, onSendMessage }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const otherUser = conversation?.users.find(u => u.id !== currentUserId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Avatar src={otherUser?.photoUrl} alt={otherUser?.name} />
          <div>
            <h3 className="font-bold text-gray-900">{otherUser?.name}</h3>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Safety Warning */}
      <div className="bg-yellow-50 px-4 py-2 text-xs text-yellow-800 flex items-center justify-center gap-2 border-b border-yellow-100">
        <AlertTriangle size={14} />
        <span>Safety Tip: Do not share financial info. Meet in public places.</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;