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

    // Redirect authenticated users based on their state
    if (user) {
        if (!user.emailVerified) {
            return <Navigate to={ROUTES.VERIFY_EMAIL} replace state={{ email: user.email }} />;
        }
        if (!userProfile) {
            return <Navigate to={ROUTES.PROFILE_SETUP} replace />;
        }
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default SignupRoute;
