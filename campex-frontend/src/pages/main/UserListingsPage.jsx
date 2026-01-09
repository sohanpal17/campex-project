import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import ProductGrid from '@/components/home/ProductGrid';
import Loader from '@/components/common/Loader';

const UserListingsPage = () => {
  const { userId } = useParams();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['userListings', userId],
    queryFn: () => userService.getUserListings(userId),
  });

  const user = listings?.[0]?.seller;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              {user.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-600">{user.academicYear}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Listings */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants} className="text-xl font-semibold text-gray-900 mb-4">
            Active Listings ({listings?.length || 0})
          </motion.h2>
          <motion.div variants={itemVariants}>
            <ProductGrid products={listings || []} loading={isLoading} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserListingsPage;