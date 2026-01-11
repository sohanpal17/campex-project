import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { validatePassword } from '@/utils/validators';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, VERIFICATION_CODE_LENGTH } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    // Step 1: Send verification code
    const handleSendCode = async (data) => {
        setIsLoading(true);
        try {
            await authService.sendPasswordResetCode(data.email);
            setEmail(data.email);
            setStep(2);
            handleSuccess('Verification code sent to your email!');
            reset();
        } catch (error) {
            handleError(error, 'Failed to send code');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify code
    const handleVerifyCode = async (e) => {
        if (e) e.preventDefault();

        if (code.length !== VERIFICATION_CODE_LENGTH) {
            handleError(null, 'Please enter the complete verification code');
            return;
        }

        setIsLoading(true);
        try {
            await authService.verifyPasswordResetCode(email, code);
            setStep(3);
            handleSuccess('Code verified! Please enter your new password.');
            reset();
        } catch (error) {
            handleError(error, 'Invalid or expired code');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (data) => {
        setIsLoading(true);
        try {
            await authService.resetPassword(email, data.password);
            handleSuccess('Password reset successfully!');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            handleError(error, 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const password = watch('password');

    return (
        <div className="w-full max-w-md mx-auto py-10"> {/* Added mx-auto and py-10 for better centering */}
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
                        {step === 1 && 'Reset Password'}
                        {step === 2 && 'Enter Verification Code'}
                        {step === 3 && 'Create New Password'}
                    </h1>
                    <p className="text-gray-600">
                        {step === 1 && 'Enter your email to receive a verification code'}
                        {step === 2 && (
                            <>
                                <p>We sent a 6-digit code to {email}</p>
                                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 mx-auto">
                                    <p className="text-sm text-amber-800 font-medium">
                                        Check your Spam folder if you don't see it
                                    </p>
                                </div>
                            </>
                        )}
                        {step === 3 && 'Enter your new password'}
                    </p>
                </div>

                {/* Form */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(handleSendCode)} className="space-y-6">
                        <Input
                            label="College Email"
                            type="email"
                            placeholder="Email ID"
                            required
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                            })}
                        />

                        <Button type="submit" className="w-full" loading={isLoading}>
                            Send Verification Code
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <VerificationCodeInput
                                length={VERIFICATION_CODE_LENGTH}
                                value={code}
                                onChange={setCode}
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            onClick={handleVerifyCode}
                            className="w-full"
                            loading={isLoading}
                            disabled={code.length !== VERIFICATION_CODE_LENGTH}
                        >
                            Verify Code
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Resend Code
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    required
                                    error={errors.password?.message}
                                    className="pr-10" // Padding right to prevent text overlap with icon
                                    {...register('password', {
                                        required: 'Password is required',
                                        validate: validatePassword,
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    required
                                    error={errors.confirmPassword?.message}
                                    className="pr-10"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" loading={isLoading}>
                            Reset Password
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;