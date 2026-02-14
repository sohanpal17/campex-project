import { Linkedin, User as UserIcon } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { generateRoute } from '@/constants/routes';

const UserProfileModal = ({ user, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const handleViewListings = () => {
        onClose();
        navigate(generateRoute.userListings(user.id));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Seller Profile"
            size="sm"
        >
            <div className="flex flex-col items-center">
                {/* Profile Photo */}
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                    {user.profilePhotoUrl ? (
                        <img
                            src={user.profilePhotoUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <UserIcon size={40} className="text-gray-400" />
                    )}
                </div>

                {/* Name & Academic Year */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {user.fullName}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-4">
                    {user.academicYear}
                </p>

                {/* Bio */}
                {user.bio && (
                    <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            About
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {user.bio}
                        </p>
                    </div>
                )}

                {/* LinkedIn */}
                {user.linkedinUrl && (
                    <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6 hover:underline"
                    >
                        <Linkedin size={18} />
                        LinkedIn Profile
                    </a>
                )}


            </div>
        </Modal>
    );
};

export default UserProfileModal;
