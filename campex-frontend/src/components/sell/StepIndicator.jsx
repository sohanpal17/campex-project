import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index < currentStep
                    ? 'bg-primary-500 text-white'
                    : index === currentStep
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? <Check size={20} /> : index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-4 rounded ${
                  index < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;