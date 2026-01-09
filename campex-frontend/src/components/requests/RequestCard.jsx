import { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '@/utils/formatters';
import { generateRoute } from '@/constants/routes';
import { messageService } from '@/services/message.service';
import { handleError } from '@/utils/errorHandler';
import Button from '@/components/common/Button';

const RequestCard = ({ request, onDelete, isOwn }) => {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);

    const handleChat = async () => {
        setIsMessaging(true);
        try {
            // Create or get existing conversation with the requester
            const conversation = await messageService.getOrCreateConversation(
                request.requester.id,
                null // no product context for requests
            );
            // Navigate to the conversation
            navigate(generateRoute.chatDetail(conversation.id));
        } catch (error) {
            handleError(error, 'Failed to start conversation');
        } finally {
            setIsMessaging(false);
        }
    };

    const handleDelete = async () => {
        await onDelete(request.id);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Requester Info */}
            <div className="flex items-center gap-3 mb-4">
                {request.requester.profilePhotoUrl ? (
                    <img
                        src={request.requester.profilePhotoUrl}
                        alt={request.requester.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-bold">
                        {request.requester.fullName?.charAt(0)}
                    </div>
                )}
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{request.requester.fullName}</h4>
                    <p className="text-sm text-gray-500">
                        {request.requester.academicYear} • {formatTimeAgo(request.createdAt)}
                    </p>
                </div>
                {isOwn && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 p-2"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Request Content */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Chat Button */}
            {request.canChat && (
                <Button
                    onClick={handleChat}
                    variant="primary"
                    className="flex items-center gap-2"
                    loading={isMessaging}
                    disabled={isMessaging}
                >
                    <MessageCircle size={18} />
                    Chat with Requester
                </Button>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Request?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this request? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestCard;
