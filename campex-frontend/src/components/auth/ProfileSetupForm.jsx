import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, ACADEMIC_YEARS } from '@/constants';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';

const ProfileSetupForm = ({ email }) => {
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const profileData = {
        fullName: data.fullName,
        academicYear: data.academicYear,
        phoneNumber: data.phoneNumber || null,
      };

      console.log('Submitting profile data:', profileData); // Debug log

      await authService.completeProfile(profileData);

      // Refresh the user profile in AuthContext
      await refreshUserProfile();

      handleSuccess('Profile created successfully!');
      navigate(ROUTES.HOME);
    } catch (error) {
      handleError(error, 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        required
        error={errors.fullName?.message}
        {...register('fullName', {
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
      />

      {/* Academic Year */}
      <Select
        label="Academic Year"
        required
        options={ACADEMIC_YEARS}
        placeholder="Select your year"
        error={errors.academicYear?.message}
        {...register('academicYear', {
          required: 'Academic year is required',
        })}
      />

      {/* Phone Number */}
      <Input
        label="Phone Number (Optional)"
        type="tel"
        placeholder="98765 43210"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber', {
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Phone number must be 10 digits',
          },
        })}
      />

      {/* Submit Button */}
      <Button type="submit" className="w-full" loading={isLoading}>
        Complete Setup
      </Button>
    </form>
  );
};

export default ProfileSetupForm;