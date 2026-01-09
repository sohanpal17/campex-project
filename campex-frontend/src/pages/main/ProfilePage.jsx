import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';
import { maskEmail, formatDate } from '@/utils/formatters';
import ProductGrid from '@/components/home/ProductGrid';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const ProfilePage = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('listings');
  const [listingsTab, setListingsTab] = useState('active');

  // Check if tab parameter is set in URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'listings') {
      setActiveTab('listings');
    }
  }, [searchParams]);

  const { data: myListings, isLoading: loadingListings } = useQuery({
    queryKey: ['myListings', listingsTab],
    queryFn: () => userService.getMyListings(listingsTab.toUpperCase()),
    enabled: !!userProfile,
  });

  // Separate query for ALL listings to calculate stats
  const { data: allListings } = useQuery({
    queryKey: ['allMyListings'],
    queryFn: async () => {
      const active = await userService.getMyListings('ACTIVE');
      const sold = await userService.getMyListings('SOLD');
      return [...(active || []), ...(sold || [])];
    },
    enabled: !!userProfile,
  });

  const { data: savedItems, isLoading: loadingSaved } = useQuery({
    queryKey: ['savedItems'],
    queryFn: () => userService.getSavedItems(),
    enabled: activeTab === 'saved' && !!userProfile,
  });

  // Redirect to profile setup if user is authenticated but profile doesn't exist
  useEffect(() => {
    if (!authLoading && user && !userProfile) {
      navigate(ROUTES.PROFILE_SETUP, {
        state: { email: user.email }
      });
    }
  }, [user, userProfile, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const stats = [
    { label: 'Listed', value: allListings?.filter((p) => p.status === 'ACTIVE').length || 0, icon: '📦' },
    { label: 'Sold', value: allListings?.filter((p) => p.status === 'SOLD').length || 0, icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {userProfile.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt={userProfile.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                  {userProfile.fullName?.charAt(0)}
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.fullName}</h1>
                <p className="text-gray-600">{maskEmail(userProfile.email)}</p>
                <p className="text-sm text-gray-500">
                  {userProfile.academicYear} • Joined {formatDate(userProfile.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link to={ROUTES.EDIT_PROFILE}>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Edit size={18} />
                  Edit Profile
                </Button>
              </Link>
              <Link to={ROUTES.SETTINGS}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings size={18} />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm"
        >
          {/* Tab Headers */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'listings'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'saved'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Saved Items
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'listings' && (
              <div>
                {/* Listings Sub-tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {['active', 'sold'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setListingsTab(tab)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${listingsTab === tab
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Listings Grid */}
                <ProductGrid products={myListings || []} loading={loadingListings} />
              </div>
            )}

            {activeTab === 'saved' && (
              <ProductGrid products={savedItems || []} loading={loadingSaved} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;