import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME, ROUTES } from '@/constants';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.LANDING} className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-700 hover:text-primary-600 font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 text-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <Hero />

      <motion.div
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Features />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <HowItWorks />
      </motion.div>



      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <CTA />
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-primary-600 mb-3">
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
                  <Link to={ROUTES.HOME} className="text-gray-600 hover:text-primary-600 text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 text-sm">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-600 hover:text-primary-600 text-sm">
                    Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a href="mailto:sohan.work.ai179@gmail.com" className="text-gray-600 hover:text-primary-600 text-sm">
                    Contact Us
                  </a>
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

          <hr className="mb-6" />

          <div className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;