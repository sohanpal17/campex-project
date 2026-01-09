import { Link, useParams } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';
import { formatTimeAgo } from '@/utils/formatters';

const ConversationItem = ({ conversation, currentUserId }) => {
  const { id: activeId } = useParams();
  const isActive = activeId === conversation.id;

  // Find other participant
  const otherUser = conversation.users.find(u => u.id !== currentUserId) || {};
  const isUnread = !conversation.lastMessageRead && conversation.lastMessageSenderId !== currentUserId;

  return (
    <Link
      to={`/chats/${conversation.id}`}
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
        isActive ? 'bg-primary-50 border-primary-100' : ''
      }`}
    >
      <div className="relative">
        <Avatar src={otherUser.photoUrl} alt={otherUser.name} size="md" />
        {otherUser.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className={`text-sm font-semibold truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
            {otherUser.name}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatTimeAgo(conversation.lastMessageAt)}
          </span>
        </div>
        <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
          {conversation.lastMessageSenderId === currentUserId && 'You: '}
          {conversation.lastMessageText}
        </p>
      </div>

      {isUnread && (
        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0"></div>
      )}
    </Link>
  );
};

export default ConversationItem;