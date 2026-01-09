import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { userService } from '@/services/user.service';
import { cloudinaryService } from '@/services/cloudinary.service';
import { useAuth } from '@/context/AuthContext';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, ACADEMIC_YEARS } from '@/constants';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';



const EditProfilePage = () => {
  const navigate = useNavigate();
  const { userProfile, loading: authLoading, refreshUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load user profile data into form
  useEffect(() => {
    if (userProfile) {
      setValue('fullName', userProfile.fullName || '');
      setValue('academicYear', userProfile.academicYear || '');
      setValue('phoneNumber', userProfile.phoneNumber || '');
      setProfilePhotoPreview(userProfile.profilePhotoUrl);
    }
  }, [userProfile, setValue]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        handleError(null, 'Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
        setProfilePhotoFile(file);
        setRemovePhoto(false); // Reset remove flag when new photo is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoPreview(null);
    setProfilePhotoFile(null);
    setRemovePhoto(true);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let photoUrl = userProfile?.profilePhotoUrl;

      // Handle photo removal
      if (removePhoto) {
        photoUrl = null;
      }
      // Upload new photo if changed
      else if (profilePhotoFile) {
        setIsUploadingPhoto(true);
        try {
          photoUrl = await cloudinaryService.uploadImage(profilePhotoFile);
        } catch (error) {
          handleError(error, 'Failed to upload profile photo');
          setIsSubmitting(false);
          setIsUploadingPhoto(false);
          return;
        }
        setIsUploadingPhoto(false);
      }

      // Update profile
      const profileData = {
        fullName: data.fullName,
        academicYear: data.academicYear,
        phoneNumber: data.phoneNumber,
        profilePhotoUrl: photoUrl,
      };

      await userService.updateProfile(profileData);
      await refreshUserProfile(); // Refresh the auth context
      handleSuccess('Profile updated successfully!');
      navigate(ROUTES.PROFILE);
    } catch (error) {
      handleError(error, 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
      setIsUploadingPhoto(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-6">
                {/* Photo Preview */}
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                    <User size={40} />
                  </div>
                )}

                {/* Upload and Remove Buttons */}
                <div>
                  <div className="flex gap-2">
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Upload size={18} />
                      Change Photo
                    </label>
                    {(profilePhotoPreview || userProfile?.profilePhotoUrl) && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              required
              error={errors.fullName?.message}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                maxLength: { value: 50, message: 'Name must not exceed 50 characters' },
              })}
            />

            {/* Academic Year */}
            <Select
              label="Academic Year"
              required
              options={ACADEMIC_YEARS}
              error={errors.academicYear?.message}
              {...register('academicYear', { required: 'Academic year is required' })}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              required
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits',
                },
              })}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting || isUploadingPhoto}
                className="flex-1"
              >
                {isUploadingPhoto ? 'Uploading Photo...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
