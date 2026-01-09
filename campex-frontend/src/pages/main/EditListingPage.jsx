import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { productService } from '@/services/product.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, CATEGORIES } from '@/constants';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const priceType = watch('priceType');

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        category: product.category,
        priceType: product.isFree ? 'FREE' : 'SELLING',
        price: product.price,
        isNegotiable: product.isNegotiable,
        isAvailableForRent: product.isAvailableForRent || false,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    console.log('=== EDIT LISTING FORM SUBMITTED ===');
    console.log('Form data:', data);

    setIsSubmitting(true);
    try {
      const updateData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.priceType === 'FREE' ? 0 : parseFloat(data.price),
        isFree: data.priceType === 'FREE',
        isNegotiable: data.priceType === 'SELLING' && data.isNegotiable,
        isAvailableForRent: data.isAvailableForRent || false,
      };

      console.log('Sending update to API:', updateData);
      const result = await productService.updateProduct(id, updateData);
      console.log('API response:', result);

      // Invalidate queries to refresh cached data
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['myListings'] });
      await queryClient.invalidateQueries({ queryKey: ['allMyListings'] });

      handleSuccess('Listing updated successfully!');
      navigate(ROUTES.PROFILE + '?tab=listings');
    } catch (error) {
      console.error('Update failed:', error);
      handleError(error, 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              required
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 10, message: 'Title must be at least 10 characters' },
              })}
            />

            {/* Category */}
            <Select
              label="Category"
              required
              options={CATEGORIES}
              error={errors.category?.message}
              {...register('category', { required: 'Category is required' })}
            />

            {/* Description */}
            <Textarea
              label="Description"
              required
              rows={5}
              maxLength={500}
              showCount
              value={watch('description') || ''}
              error={errors.description?.message}
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' },
              })}
            />

            {/* Price Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Type <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    value="SELLING"
                    {...register('priceType')}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>💵 Selling</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    value="FREE"
                    {...register('priceType')}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span>🆓 Free</span>
                </label>
              </div>
            </div>

            {/* Price */}
            {priceType === 'SELLING' && (
              <>
                <Input
                  label="Price"
                  type="number"
                  required
                  error={errors.price?.message}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' },
                  })}
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="negotiable"
                    {...register('isNegotiable')}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="negotiable" className="font-medium text-gray-700">
                    Price is negotiable
                  </label>
                </div>
              </>
            )}

            {/* Available for Rent Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="availableForRent"
                {...register('isAvailableForRent')}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <label htmlFor="availableForRent" className="font-medium text-gray-900 block">
                  Available for Renting
                </label>
                <p className="text-sm text-gray-600">
                  Check this if you're also open to renting this item
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;