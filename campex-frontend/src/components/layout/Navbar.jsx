import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { ROUTES, APP_NAME } from '@/constants';
import { handleError, handleSuccess } from '@/utils/errorHandler';

const Navbar = () => {
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { unreadCount, markAllAsRead } = useNotifications();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleSuccess('Logged out successfully');
      navigate(ROUTES.LANDING);
    } catch (error) {
      handleError(error, 'Failed to logout');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${isActive
      ? 'bg-primary-600 text-white'
      : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to={ROUTES.HOME} className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to={ROUTES.SEARCH} className={navLinkClass}>
              Search
            </NavLink>

            <NavLink to={ROUTES.REQUESTS} className={navLinkClass}>
              Requests
            </NavLink>

            <NavLink to={ROUTES.SELL} className={navLinkClass}>
              Sell
            </NavLink>

            <NavLink to={ROUTES.CHATS} className={navLinkClass}>
              Messages
            </NavLink>

            {/* Notifications */}
            <NavLink
              to={ROUTES.NOTIFICATIONS}
              onClick={markAllAsRead} // Mark all as read when clicking notification icon
              className={({ isActive }) =>
                `relative transition-colors p-2 rounded-md ${isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {userProfile?.profilePhotoUrl ? (
                  <img
                    src={userProfile.profilePhotoUrl}
                    alt={userProfile.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                    {userProfile?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={18} />
                      My Profile
                    </Link>

                    <Link
                      to={ROUTES.SETTINGS}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={18} />
                      Settings
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-700"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 space-y-2">
            <Link to={ROUTES.HOME} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Home</Link>
            <Link to={ROUTES.SEARCH} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Search</Link>
            <Link to={ROUTES.REQUESTS} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Requests</Link>
            <Link to={ROUTES.SELL} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Sell</Link>
            <Link to={ROUTES.CHATS} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Messages</Link>

            <Link to={ROUTES.NOTIFICATIONS} className="flex items-center gap-2 py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Link>

            <hr className="my-2" />

            <Link to={ROUTES.PROFILE} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>My Profile</Link>
            <Link to={ROUTES.SETTINGS} className="block py-2 text-gray-700" onClick={() => setShowMobileMenu(false)}>Settings</Link>

            <button
              onClick={() => {
                setShowMobileMenu(false);
                handleLogout();
              }}
              className="block w-full text-left py-2 text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;