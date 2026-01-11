import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';
import { ROUTES } from '@/constants';

const ProtectedRoute = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Force onboarding: If user exists but has no profile, redirect to Verify Email
  if (!userProfile || !userProfile.fullName || !userProfile.academicYear) {
    return <Navigate to={ROUTES.VERIFY_EMAIL} state={{ email: user?.email }} replace />;
  }


  return children;
};

export default ProtectedRoute;