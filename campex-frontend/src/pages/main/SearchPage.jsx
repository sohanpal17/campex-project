import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useInView } from 'react-intersection-observer';
import SearchBar from '@/components/search/SearchBar';
import FilterPanel from '@/components/search/FilterPanel';
import ProductGrid from '@/components/home/ProductGrid';
import Loader from '@/components/common/Loader';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    categories: [],
    priceTypes: [],
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProducts({
    search: searchQuery || undefined,
    category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
    priceType: filters.priceTypes.length > 0 ? filters.priceTypes.join(',') : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.content || []) || [];

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const activeFilterCount =
    (filters.categories?.length || 0) + (filters.priceTypes?.length || 0);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Items</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} initialValue={initialQuery} />
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar (Desktop) */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </motion.div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="md:hidden mb-6">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          )}

          {/* Results */}
          <motion.div
            className="md:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Results Count */}
            {!isLoading && (
              <motion.div variants={itemVariants} className="mb-4 text-gray-600">
                {products.length > 0 ? (
                  <p>
                    Found <span className="font-semibold">{products.length}</span> items
                    {searchQuery && (
                      <>
                        {' '}
                        for "<span className="font-semibold">{searchQuery}</span>"
                      </>
                    )}
                  </p>
                ) : (
                  <p>No items found</p>
                )}
              </motion.div>
            )}

            {/* Products Grid */}
            <motion.div variants={itemVariants}>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;