import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateRoute } from '@/constants/routes';
import { formatPrice, formatTimeAgo } from '@/utils/formatters';
import { getCategoryLabel, getCategoryIcon } from '@/constants/categories';
import { getPriceTypeColor } from '@/constants/priceTypes';
import { userService } from '@/services/user.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import Badge from '@/components/common/Badge';

const ProductCard = ({ product, onSaveToggle }) => {
  const [isSaved, setIsSaved] = useState(product.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient();

  // Sync with product.isSaved when it changes
  useEffect(() => {
    setIsSaved(product.isSaved || false);
  }, [product.isSaved]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  const handleSaveToggle = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    setIsSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveItem(product.id);
        handleSuccess('Removed from saved items');
      } else {
        await userService.saveItem(product.id);
        handleSuccess('Added to saved items');
      }

      const newIsSavedValue = !isSaved;
      setIsSaved(newIsSavedValue);

      // Manually update all cached product lists immediately
      queryClient.setQueriesData(
        { queryKey: ['products'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          // Handle infinite query structure (search page)
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                content: page.content?.map(p =>
                  p.id === product.id ? { ...p, isSaved: newIsSavedValue } : p
                ) || []
              }))
            };
          }

          return oldData;
        }
      );

      // Update single product query cache
      queryClient.setQueryData(['product', String(product.id)], (oldData) =>
        oldData ? { ...oldData, isSaved: newIsSavedValue } : oldData
      );

      // Invalidate to ensure fresh data on next mount
      queryClient.invalidateQueries({ queryKey: ['savedItems'] });

      onSaveToggle?.();
    } catch (error) {
      handleError(error, 'Failed to update saved items');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Link
      to={generateRoute.itemDetails(product.id)}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{product.images.length}
              </div>
            )}

            {/* Navigation Buttons */}
            {product.images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                  title="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                  title="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getCategoryIcon(product.category)}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          disabled={isSaving}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 z-10"
        >
          <Heart
            size={20}
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Available for Rent Badge - Overlay */}
        {product.isAvailableForRent && (
          <div className="absolute top-3 left-3 z-10">
            <Badge size="sm" className="!bg-[#79864B] !text-white !border-none shadow-md">
              Rent Available
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-3">
          {product.isFree ? (
            <span className="text-xl font-bold text-green-600">FREE</span>
          ) : (
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Category */}
          <Badge variant="primary" size="sm">
            {getCategoryLabel(product.category)}
          </Badge>

          {/* Price Type */}
          <Badge
            size="sm"
            className={getPriceTypeColor(
              product.isFree ? 'FREE' : product.isNegotiable ? 'NEGOTIABLE' : 'FIXED'
            )}
          >
            {product.isFree ? '🆓 Free' : product.isNegotiable ? '💰 Negotiable' : '🔒 Fixed'}
          </Badge>
        </div>

        {/* Posted Time */}
        <p className="text-sm text-gray-500">
          Posted {formatTimeAgo(product.createdAt)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;