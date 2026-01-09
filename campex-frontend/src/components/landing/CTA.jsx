import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import Button from '@/components/common/Button';

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Join your campus community today and start buying, selling, and saving money
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.SIGNUP}>
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100"
              >
                Sign Up Now
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            
            <Link to={ROUTES.LOGIN}>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Login
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-primary-100">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="underline hover:text-white">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;