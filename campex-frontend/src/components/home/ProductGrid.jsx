import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = ({ products, loading, onSaveToggle }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No items found
        </h3>
        <p className="text-gray-600">
          No items listed for sale in the marketplace yet. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
        // Note: The parent container in HomePage usually controls the initial/animate state
        // but if used standalone, we might want defaults.
        // Since HomePage sets "visible" on parent, these children will stagger.
        >
          <ProductCard
            product={product}
            onSaveToggle={onSaveToggle}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;