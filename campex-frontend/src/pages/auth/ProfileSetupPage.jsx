import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { APP_NAME, ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ProfileSetupForm from '@/components/auth/ProfileSetupForm';
import Button from '@/components/common/Button';

const ProfileSetupPage = () => {
  const navigate = useNavigate(); // Add navigate
  const location = useLocation();
  const { user, signOut } = useAuth(); // Add signOut
  const email = location.state?.email || user?.email || '';

  if (!email) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No email provided. Please sign up first.</p>
          <Link to={ROUTES.SIGNUP}>
            <Button>Go to Signup</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircle className="text-primary-600" size={32} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Just one more step to join {APP_NAME}
          </p>
        </div>

        {/* Profile Setup Form */}
        <ProfileSetupForm email={email} />

        {/* Logout Option */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">
            Want to use a different account?
          </p>
          <button
            onClick={async () => {
              try {
                await signOut();
                navigate(ROUTES.LOGIN);
              } catch (error) {
                console.error(error);
              }
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Logout & Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;