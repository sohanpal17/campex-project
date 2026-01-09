import { APP_NAME } from '@/constants';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join {APP_NAME}, Your Campus Only Marketplace!
          </p>
        </div>

        {/* Signup Form */}
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;