import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';
import { ROUTES } from '@/constants';

const PublicRoute = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    if (userProfile && userProfile.fullName && userProfile.academicYear) {
      return <Navigate to={ROUTES.HOME} replace />;
    } else {
      // User is logged in but has no profile -> force onboarding
      return <Navigate to={ROUTES.VERIFY_EMAIL} state={{ email: user.email }} replace />;
    }
  }

  return children;
};

export default PublicRoute;