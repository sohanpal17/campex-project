import { Outlet, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { APP_NAME, ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

const AuthLayout = () => {
  const { user, userProfile, loading } = useAuth();

  // If loading, show disabled link or '#'
  // If not logged in -> Landing
  // If logged in & verified -> Home
  // If logged in & unverified -> Stay (show toast)
  const isProfileComplete = userProfile && userProfile.fullName && userProfile.academicYear;
  const homeLink = loading ? '#' : (!user ? ROUTES.LANDING : (isProfileComplete ? ROUTES.HOME : '#'));

  const handleLogoClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user && !isProfileComplete) {
      e.preventDefault();
      toast('Please verify your email and complete setup first', {
        icon: '🔒',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <Link
            to={homeLink}
            onClick={handleLogoClick}
            className={`text-2xl font-bold text-primary-600 ${homeLink === '#' ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container-custom text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;