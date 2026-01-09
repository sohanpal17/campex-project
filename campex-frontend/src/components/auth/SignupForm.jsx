import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/utils/validators';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PasswordStrength from './PasswordStrength';

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: college selection, 2: signup form
  const [selectedCollege, setSelectedCollege] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.signup(data.email, data.password);
      handleSuccess('Account created! Please verify your email.');

      // Navigate to verification page with email in state
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: data.email }, replace: true });
    } catch (error) {
      handleError(error, 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedCollege) {
      handleError({ message: 'Please select your college' });
      return;
    }
    setStep(2);
  };

  // Step 1: College Selection
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            College Name <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">Select your college</option>
            <option value="Vivekanand Education Society's Institute of Technology">
              Vivekanand Education Society's Institute of Technology
            </option>
          </select>
        </div>

        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    );
  }

  // Step 2: Full Signup Form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => setStep(1)}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
      >
        ← Back to college selection
      </button>

      {/* College Selected Info */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
        <p className="text-sm text-primary-800">
          <span className="font-medium">College:</span> {selectedCollege}
        </p>
      </div>



      {/* College Email */}
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

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            {...register('password', {
              required: 'Password is required',
              validate: validatePassword,
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        <PasswordStrength password={password} />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => validateConfirmPassword(password, value),
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      

      {/* Submit Button */}
      <Button type="submit" className="w-full" loading={isLoading}>
        Create Account
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-medium">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;