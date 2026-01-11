import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';
import { ROUTES } from '@/constants';

const SignupRoute = ({ children }) => {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    // Only redirect if user is authenticated AND has a profile
    // This allows the signup flow to continue for newly created users
    // who have a user object (from Firebase) but no profile yet
    if (user && userProfile) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default SignupRoute;
