import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '@/services/product.service';
import { cloudinaryService } from '@/services/cloudinary.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, CATEGORIES, PRICE_TYPES } from '@/constants';
import StepIndicator from '@/components/sell/StepIndicator';
import ImageUploader from '@/components/sell/ImageUploader';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatPrice } from '@/utils/formatters';

import api from '@/services/api';

const SellPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState([]);
  const [moderationStatus, setModerationStatus] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingMessage, setUploadingMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPreviewImageIndex, setCurrentPreviewImageIndex] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priceType: 'SELLING',
      isNegotiable: false,
    },
  });

  const steps = ['Photos', 'Details', 'Preview'];
  const priceType = watch('priceType');
  const formData = watch();

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate images
      if (images.length === 0) {
        handleError(null, 'Please upload at least one image');
        return;
      }

      // Validate and upload images
      setIsUploading(true);
      setUploadingMessage(''); // Clear previous messages
      try {
        const uploadedUrls = [];
        const newModerationStatus = {};

        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          // Skip if already a URL (already validated and uploaded)
          if (typeof image === 'string') {
            uploadedUrls.push(image);
            newModerationStatus[i] = true;
            continue;
          }

          // Step 1: Validate with AI before uploading
          setUploadingMessage(`Checking image ${i + 1}/${images.length} for safety...`);
          const formData = new FormData();
          formData.append('image', image);

          try {
            await api.post('/api/images/validate', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Image is safe, proceed with upload
          } catch (error) {
            // AI rejected the image - show specific error message
            const errorMsg = error.response?.data?.message || 'Image contains inappropriate content';
            handleError(null, errorMsg);
            setIsUploading(false);
            setUploadingMessage('');
            // Don't proceed to next step
            return;
          }

          // Step 2: Upload to Cloudinary (only if AI approved)
          setUploadingMessage(`Uploading image ${i + 1}/${images.length}...`);
          const url = await cloudinaryService.uploadImage(image);
          uploadedUrls.push(url);
          newModerationStatus[i] = true;
        }

        // Update state with uploaded URLs
        setImages(uploadedUrls);
        setModerationStatus(newModerationStatus);
        setCurrentStep(1);
      } catch (error) {
        handleError(error, 'Failed to process images');
      } finally {
        setIsUploading(false);
        setUploadingMessage('');
      }
    } else if (currentStep === 1) {
      // Validate all form fields
      const isValid = await trigger();
      if (!isValid) {
        // Scroll to first error
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return;
      }

      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const productData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.priceType === 'FREE' ? 0 : parseFloat(data.price),
        isFree: data.priceType === 'FREE',
        isNegotiable: data.priceType === 'SELLING' && data.isNegotiable,
        isAvailableForRent: data.isAvailableForRent || false,
        images: images,
      };

      await productService.createProduct(productData);

      // Invalidate queries to refresh product lists and user listings
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });

      handleSuccess('Item listed successfully!');
      navigate(ROUTES.HOME);
    } catch (error) {
      handleError(error, 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Cancel
          </button>
          <h1 className="text-3xl font-bold text-gray-900">List Your Item</h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Photos */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Photos</h2>
                <p className="text-gray-600 mb-6">
                  Upload clear photos of your item. The first photo will be the cover image.
                </p>
                <ImageUploader
                  images={images}
                  onImagesChange={setImages}
                  moderationStatus={moderationStatus}
                />
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Details</h2>
                <p className="text-gray-600 mb-6">Provide information about your item</p>

                <form className="space-y-6">
                  {/* Title */}
                  <Input
                    label="Title"
                    placeholder="e.g., Chemistry Textbook - 14th Edition"
                    required
                    error={errors.title?.message}
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 10, message: 'Title must be at least 10 characters' },
                      maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
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
                  <div>
                    <Textarea
                      label="Description"
                      placeholder="Describe the item, its condition, why you're selling..."
                      required
                      rows={5}
                      maxLength={500}
                      error={errors.description?.message}
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 20, message: 'Description must be at least 20 characters' },
                        maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                      })}
                    />
                    {formData.description && (
                      <p className="text-sm text-gray-500 mt-1 text-right">
                        {formData.description.length}/500
                      </p>
                    )}
                  </div>

                  {/* Price Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Price Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="SELLING"
                          {...register('priceType')}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="font-medium">💵 Selling</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="FREE"
                          {...register('priceType')}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="font-medium">🆓 Free</span>
                      </label>
                    </div>
                  </div>

                  {/* Price (if selling) */}
                  {priceType === 'SELLING' && (
                    <>
                      <Input
                        label="Price"
                        type="number"
                        placeholder="0"
                        required
                        error={errors.price?.message}
                        {...register('price', {
                          required: 'Price is required',
                          min: { value: 1, message: 'Price must be greater than 0' },
                        })}
                      />

                      {/* Negotiable Toggle */}
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
                </form>
              </motion.div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Listing</h2>
                <p className="text-gray-600 mb-6">Review how your listing will appear to buyers</p>

                {/* Preview Card */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {images[currentPreviewImageIndex] && (
                      <>
                        <img src={images[currentPreviewImageIndex]} alt="Preview" className="w-full h-full object-cover" />

                        {/* Image Counter */}
                        {images.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {currentPreviewImageIndex + 1}/{images.length}
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setCurrentPreviewImageIndex((prev) =>
                                prev === 0 ? images.length - 1 : prev - 1
                              )}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                            >
                              <ChevronLeft size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setCurrentPreviewImageIndex((prev) =>
                                prev === images.length - 1 ? 0 : prev + 1
                              )}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{formData.title}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    {formData.priceType === 'FREE' ? (
                      <span className="text-3xl font-bold text-green-600">FREE</span>
                    ) : (
                      <span className="text-3xl font-bold text-primary-600">
                        {formatPrice(formData.price)}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="primary">
                      {CATEGORIES.find(c => c.value === formData.category)?.label || formData.category}
                    </Badge>
                    <Badge variant={formData.priceType === 'FREE' ? 'success' : 'accent'}>
                      {formData.priceType === 'FREE'
                        ? '🆓 Free'
                        : formData.isNegotiable
                          ? '💰 Negotiable'
                          : '🔒 Fixed Price'}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>

                  {/* Images Count */}
                  {images.length > 1 && (
                    <p className="mt-4 text-sm text-gray-500">{images.length} images</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 0 && (
              <Button variant="secondary" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft size={20} />
                Back
              </Button>
            )}

            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                loading={isUploading}
                className="ml-auto flex items-center gap-2"
              >
                {isUploading && uploadingMessage ? uploadingMessage : 'Next'}
                {!isUploading && <ArrowRight size={20} />}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                loading={isSubmitting}
                className="ml-auto"
              >
                Post Item
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;