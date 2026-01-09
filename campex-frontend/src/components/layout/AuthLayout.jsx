import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '@/constants';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
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