import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { MAX_IMAGES_PER_PRODUCT } from '@/constants';

const ImageUploader = ({ images, onImagesChange, moderationStatus = {} }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (images.length + acceptedFiles.length > MAX_IMAGES_PER_PRODUCT) {
        alert(`Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed`);
        return;
      }
      onImagesChange([...images, ...acceptedFiles]);
    },
    [images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Upload Area */}
      {images.length < MAX_IMAGES_PER_PRODUCT && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-700 font-medium mb-2">
            {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            Max {MAX_IMAGES_PER_PRODUCT} images • JPG, JPEG, PNG, WebP • Max 5MB each
          </p>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">
            {images.length} / {MAX_IMAGES_PER_PRODUCT} images
            {images.length > 0 && ' • First image will be the cover'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />

                {/* Cover Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full font-medium">
                    Cover
                  </div>
                )}

                {/* Moderation Status */}
                {moderationStatus[index] !== undefined && (
                  <div className="absolute top-2 right-2">
                    {moderationStatus[index] ? (
                      <div className="p-1 bg-green-500 rounded-full">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    ) : (
                      <div className="p-1 bg-red-500 rounded-full">
                        <AlertCircle size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;