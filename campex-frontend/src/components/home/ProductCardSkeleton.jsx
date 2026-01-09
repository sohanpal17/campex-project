const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

        {/* Price */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-3" />

        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>

        {/* Time */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;