import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ROUTES, VERIFICATION_CODE_LENGTH } from '@/constants';
import Button from '@/components/common/Button';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-verify when code is complete
  useEffect(() => {
    if (code.length === VERIFICATION_CODE_LENGTH) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== VERIFICATION_CODE_LENGTH) {
      handleError(null, 'Please enter the complete verification code');
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyCode(email, code);
      handleSuccess('Email verified successfully!');
      navigate(ROUTES.PROFILE_SETUP, { state: { email } });
    } catch (error) {
      handleError(error, 'Invalid verification code');
      setCode(''); // Clear code on error
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.sendVerificationCode(email);
      handleSuccess('Verification code sent!');
      setCountdown(60);
      setCanResend(false);
      setCode('');
    } catch (error) {
      handleError(error, 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No email provided</p>
          <Link to={ROUTES.SIGNUP}>
            <Button>Go to Signup</Button>
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
            <Mail className="text-primary-600" size={32} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We sent a 6-digit code to
          </p>
          <p className="text-gray-900 font-medium mt-1">{email}</p>
        </div>

        {/* Code Input */}
        <div className="mb-6">
          <VerificationCodeInput
            length={VERIFICATION_CODE_LENGTH}
            value={code}
            onChange={setCode}
            disabled={isVerifying}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          className="w-full mb-4"
          loading={isVerifying}
          disabled={code.length !== VERIFICATION_CODE_LENGTH}
        >
          Verify Email
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend in {countdown}s
            </p>
          )}
        </div>

        {/* Change Email */}
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.SIGNUP}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Change Email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;