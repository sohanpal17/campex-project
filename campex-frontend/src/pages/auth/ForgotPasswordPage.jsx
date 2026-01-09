import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { validateEmail } from '@/utils/validators';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      handleSuccess('Password reset link sent to your email!');
      setEmailSent(true);
    } catch (error) {
      handleError(error, 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <KeyRound className="text-green-600" size={32} />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We've sent you a password reset link. Please check your email and follow the instructions.
            </p>
          </div>

          {/* Back to Login */}
          <Link to={ROUTES.LOGIN}>
            <Button className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <KeyRound className="text-primary-600" size={32} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" className="w-full" loading={isLoading}>
            Send Reset Link
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;