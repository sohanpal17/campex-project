import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/constants';
import ProductGrid from '@/components/home/ProductGrid';
import CampaignCarousel from '@/components/home/CampaignCarousel';
import CreateRequestModal from '@/components/requests/CreateRequestModal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { campaignService } from '@/services/campaign.service';

const HomePage = () => {
  const [filters] = useState({
    categories: [],
    priceTypes: [],
  });

  const [showBanner, setShowBanner] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Fetch active campaigns from backend
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', 'active'],
    queryFn: () => campaignService.getActiveCampaigns(),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProducts(filters);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.content || []) || [];

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Campus Marketplace
            </h1>
            <p className="text-gray-600">
              Buy and sell items within your college community
            </p>
          </div>

          {/* Sell Button (Desktop) */}
          <div className="hidden md:flex gap-3">
            <Link to={ROUTES.SELL} className="inline-block">
              <Button className="flex items-center gap-2 w-full h-12">
                <Plus size={20} />
                List an Item
              </Button>
            </Link>
            <Button
              className="flex items-center gap-2 h-12"
              onClick={() => setShowRequestModal(true)}
            >
              <Plus size={20} />
              Request Item
            </Button>
            <Link to={`${ROUTES.SETTINGS}?highlightMailUs=true`} className="inline-block">
              <Button variant="secondary" className="flex items-center gap-2 w-full h-12">
                Request Advertisement
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Campaign Carousel - Shows all active campaigns with auto-rotation */}
        {showBanner && campaigns && campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CampaignCarousel
              campaigns={campaigns}
              onClose={() => setShowBanner(false)}
            />
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ProductGrid
            products={products}
            loading={isLoading}
            onSaveToggle={refetch}
          />
        </motion.div>

        {/* Infinite Scroll Trigger */}
        {hasNextPage && (
          <div ref={ref} className="py-8 flex justify-center">
            {isFetchingNextPage && <Loader size="md" />}
          </div>
        )}

        {/* No More Items */}
        {!hasNextPage && products.length > 0 && (
          <p className="text-center text-gray-500 py-8">
            No more items to load
          </p>
        )}

        {/* Floating Sell Button (Mobile) */}
        <Link
          to={ROUTES.SELL}
          className="md:hidden fixed bottom-6 right-6 z-30"
        >
          <button className="bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors">
            <Plus size={24} />
          </button>
        </Link>

        {/* Create Request Modal */}
        <CreateRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        />
      </div>
    </div>
  );
};

export default HomePage;