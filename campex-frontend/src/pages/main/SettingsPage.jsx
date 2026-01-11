import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES } from '@/constants';
import { userService } from '@/services/user.service';
import Button from '@/components/common/Button';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [highlightMailUs, setHighlightMailUs] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check URL parameter to auto-open Safety Tips
  useEffect(() => {
    if (searchParams.get('showSafetyTips') === 'true') {
      setShowSafetyTips(true);
      setSearchParams({});
    }
    if (searchParams.get('highlightMailUs') === 'true') {
      setHighlightMailUs(true);
      setSearchParams({});
      // Scroll to Mail Us button
      setTimeout(() => {
        document.getElementById('mail-us-button')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      // Remove highlight after 3 seconds
      setTimeout(() => setHighlightMailUs(false), 3000);
    }
  }, [searchParams, setSearchParams]);

  const handleLogout = async () => {
    try {
      navigate(ROUTES.LANDING);
      await signOut();
      handleSuccess('Logged out successfully');
    } catch (error) {
      handleError(error, 'Failed to logout');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      navigate(ROUTES.LANDING);
      await signOut(); // Sign out after deletion
      handleSuccess('Account deleted successfully');
    } catch (error) {
      handleError(error, 'Failed to delete account');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="space-y-6">


          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(ROUTES.BLOCKED_USERS)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-gray-900">Blocked Users</p>
                  <p className="text-sm text-gray-600">Manage blocked accounts</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setShowSafetyTips(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-gray-900">Safety Tips</p>
                  <p className="text-sm text-gray-600">Stay safe while using Campex</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                id="mail-us-button"
                onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=sohan.work.ai179@gmail.com&su=Mail%20Us&body=Please describe your request or issue:', '_blank')}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors text-left ${highlightMailUs ? 'animate-pulse bg-primary-100 border-2 border-primary-500' : ''
                  }`}
              >
                <div>
                  <p className="font-medium text-gray-900">Mail Us</p>
                  <p className="text-sm text-gray-600">For poster requests or any issues</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>



          {/* Logout */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </Button>
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Delete Account?</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data including listings, messages, and saved items will be permanently deleted.
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-6">
              Are you absolutely sure?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                loading={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tips Modal */}
      {showSafetyTips && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🛡️ Safety Tips</h3>
            <p className="text-sm text-gray-600 mb-6">Stay safe while using Campex marketplace</p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Interact only with verified students within your campus.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Use the in-app chat for all communication.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Avoid sharing personal contact details unnecessarily.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Meet in well-lit, public areas inside the campus.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Inspect items carefully before accepting them.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Do not feel pressured to make quick decisions.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Report suspicious behavior or listings immediately.</p>
              </div>

              <div className="flex gap-3">
                <span className="text-primary-600 mt-1">✓</span>
                <p className="text-gray-700">Block users if you feel uncomfortable or unsafe.</p>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={() => setShowSafetyTips(false)}
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;