import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Flag, Edit, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '@/services/product.service';
import { useAuth } from '@/context/AuthContext';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { formatPrice, formatTimeAgo } from '@/utils/formatters';
import { getCategoryLabel } from '@/constants/categories';
import { generateRoute, ROUTES } from '@/constants/routes';
import ImageCarousel from '@/components/product/ImageCarousel';
import ImageLightbox from '@/components/product/ImageLightbox';
import ProductActions from '@/components/product/ProductActions';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isMarkingActive, setIsMarkingActive] = useState(false);

  const { data: product, isLoading, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">This item may have been removed or sold</p>
          <Link to="/home" className="text-primary-600 hover:text-primary-700 font-medium">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.deleteProduct(id);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['myListings'] });
      await queryClient.invalidateQueries({ queryKey: ['allMyListings'] });
      handleSuccess('Listing deleted successfully!');
      navigate(ROUTES.PROFILE);
    } catch (error) {
      handleError(error, 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    navigate(generateRoute.editListing(id));
  };

  const handleMarkAsSold = async () => {
    setIsMarkingSold(true);
    try {
      await productService.markAsSold(id);
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['myListings'] });
      await queryClient.invalidateQueries({ queryKey: ['allMyListings'] });
      handleSuccess('Item marked as sold!');
      setShowSoldModal(false);
    } catch (error) {
      handleError(error, 'Failed to mark as sold');
    } finally {
      setIsMarkingSold(false);
    }
  };

  const handleMarkAsActive = async () => {
    setIsMarkingActive(true);
    try {
      await productService.markAsActive(id);
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['myListings'] });
      await queryClient.invalidateQueries({ queryKey: ['allMyListings'] });
      handleSuccess('Item marked as active!');
      setShowActiveModal(false);
    } catch (error) {
      handleError(error, 'Failed to mark as active');
    } finally {
      setIsMarkingActive(false);
    }
  };

  // Check if current user is the owner (only after product is loaded)
  const isOwner = userProfile && product?.seller?.id === userProfile.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageCarousel images={product.images} onImageClick={handleImageClick} />
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-4">
                {product.isFree ? (
                  <span className="text-4xl font-bold text-green-600">FREE</span>
                ) : (
                  <span className="text-4xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="primary">
                  {getCategoryLabel(product.category)}
                </Badge>
                <Badge variant={product.isFree ? 'success' : 'accent'}>
                  {product.isFree ? '🆓 Free' : product.isNegotiable ? '💰 Negotiable' : '🔒 Fixed Price'}
                </Badge>
                {product.isAvailableForRent && (
                  <Badge variant="info">
                    Available for Rent
                  </Badge>
                )}
              </div>

              {/* Seller Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Seller</h3>
                <Link
                  to={generateRoute.userListings(product.seller.id)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {product.seller.profilePhotoUrl ? (
                    <img
                      src={product.seller.profilePhotoUrl}
                      alt={product.seller.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-lg">
                      {product.seller.fullName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{product.seller.fullName}</div>
                    <div className="text-sm text-gray-500">{product.seller.academicYear}</div>
                  </div>
                </Link>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Details */}
              <div className="mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium text-gray-900">
                    {formatTimeAgo(product.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions for non-owners */}
              {!isOwner && (
                <ProductActions
                  product={product}
                  isSaved={product.isSaved}
                  onSaveToggle={() => refetch()}
                />
              )}

              {/* Actions for owners */}
              {isOwner && (
                <div className="space-y-3">
                  {/* Edit and Delete buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleEdit}
                      className="flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit Listing
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </Button>
                  </div>

                  {/* Mark as Sold or Active button */}
                  {product.status === 'ACTIVE' ? (
                    <Button
                      variant="success"
                      onClick={() => setShowSoldModal(true)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark as Sold
                    </Button>
                  ) : product.status === 'SOLD' && (
                    <Button
                      variant="primary"
                      onClick={() => setShowActiveModal(true)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark as Active
                    </Button>
                  )}
                </div>
              )}

              {/* Report (only for non-owners) */}
              {!isOwner && (
                <button
                  onClick={() => navigate(ROUTES.REPORT, { state: { product } })}
                  className="mt-4 text-sm text-red-600 hover:text-red-800 hover:underline"
                >
                  Report this listing
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <ImageLightbox
          images={product.images}
          initialIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Listing?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                loading={isDeleting}
                variant="danger"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Sold Confirmation Modal */}
      {showSoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mark as Sold?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this item as sold? You can revert this later if needed.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowSoldModal(false)}
                className="flex-1"
                disabled={isMarkingSold}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkAsSold}
                loading={isMarkingSold}
                variant="success"
                className="flex-1"
              >
                Mark as Sold
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Active Confirmation Modal */}
      {showActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mark as Active?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this item as active again? It will be visible to buyers.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowActiveModal(false)}
                className="flex-1"
                disabled={isMarkingActive}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkAsActive}
                loading={isMarkingActive}
                className="flex-1"
              >
                Mark as Active
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage;