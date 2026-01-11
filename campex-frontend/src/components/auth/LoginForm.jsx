import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { validateEmail } from '@/utils/validators';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const LoginForm = () => {
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.login(data.email, data.password);

      // Attempt to refresh profile to check if it exists
      try {
        const profile = await refreshUserProfile();
        handleSuccess('Login successful!');

        if (profile && profile.fullName && profile.academicYear) {
          navigate(ROUTES.HOME);
        } else {
          // No profile or incomplete profile -> Onboarding flow
          navigate(ROUTES.VERIFY_EMAIL, { state: { email: data.email, codeSent: false }, replace: true });
        }
      } catch (error) {
        // If 422/404, it means no profile
        navigate(ROUTES.VERIFY_EMAIL, { state: { email: data.email, codeSent: false }, replace: true });
      }
    } catch (error) {
      let errorMessage = 'Failed to login';

      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error?.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error?.message) {
        errorMessage = error.message.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/.*?\)\s*\.?$/g, '');
      }

      handleError(error, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <Input
        label="College Email"
        type="email"
        placeholder="Email ID"
        required
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          validate: validateEmail,
        })}
      />

      {/* Password - Aligned using Relative Container */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            error={errors.password?.message}
            className="pr-10" // Add right padding so text doesn't hit the icon
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" loading={isLoading}>
        Login
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-primary-600 hover:text-primary-700 font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;