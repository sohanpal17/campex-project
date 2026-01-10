import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  BookOpen,
  Calculator,
  Shirt,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import Button from '@/components/common/Button';

const Hero = () => {
  const [savedItems, setSavedItems] = useState({
    book: false,
    calculator: false,
    coat: false,
  });

  const toggleSave = (key) => {
    setSavedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white pt-20 pb-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Campus{' '}
              <span className="text-primary-600">Marketplace</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Buy and sell items easily within your college community.
              Safe, verified, and built for students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={ROUTES.SIGNUP}>
                <Button size="lg" className="w-full sm:w-auto h-14">
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14">
                  Learn More
                </Button>
              </a>
            </div>


          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-primary-700 rounded-2xl p-12 shadow-2xl">
                <div className="space-y-6">

                  {/* Book */}
                  <div className="bg-primary-300 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                        <BookOpen size={28} className="text-primary-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Chemistry Textbook
                        </div>
                        <div className="text-sm text-gray-600">₹450</div>
                      </div>
                      <button onClick={() => toggleSave('book')}>
                        <Heart
                          size={20}
                          className={`transition-colors ${savedItems.book
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-800'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="bg-primary-300 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Calculator size={28} className="text-primary-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Calculator</div>
                        <div className="text-sm text-green-600 font-medium">
                          FREE
                        </div>
                      </div>
                      <button onClick={() => toggleSave('calculator')}>
                        <Heart
                          size={20}
                          className={`transition-colors ${savedItems.calculator
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-800'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Lab Coat */}
                  <div className="bg-primary-300 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Shirt size={28} className="text-primary-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Lab Coat</div>
                        <div className="text-sm text-gray-600">₹200</div>
                      </div>
                      <button onClick={() => toggleSave('coat')}>
                        <Heart
                          size={20}
                          className={`transition-colors ${savedItems.coat
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-800'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-300 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;