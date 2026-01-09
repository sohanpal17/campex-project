import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/constants';

const Footer = () => {
  const navigate = useNavigate();

  const handleSafetyTips = () => {
    // Navigate to settings with safety tips parameter
    navigate(`${ROUTES.SETTINGS}?showSafetyTips=true`);
  };

  const handleContactUs = () => {
    window.location.href = 'mailto:sohan.work.ai179@gmail.com?subject=Mail%20Us&body=Please describe your request or issue:';
  };

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary-600 mb-2">
              {APP_NAME}
            </h3>
            <p className="text-gray-600 text-sm">
              Your Campus Marketplace
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary-600 text-sm">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-600 hover:text-primary-600 text-sm">
                  Sell Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.SETTINGS} className="text-gray-600 hover:text-primary-600 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSafetyTips}
                  className="text-gray-600 hover:text-primary-600 text-sm text-left"
                >
                  Safety Tips
                </button>
              </li>
              <li>
                <button
                  onClick={handleContactUs}
                  className="text-gray-600 hover:text-primary-600 text-sm text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6" />

        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;