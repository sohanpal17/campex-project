import { formatTimeAgo } from '@/utils/formatters';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          isOwn
            ? 'bg-primary-500 text-white rounded-tr-none'
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
          {formatTimeAgo(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;