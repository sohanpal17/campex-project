import { forwardRef } from 'react';

const Radio = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
          <input
            type="radio"
            ref={ref}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-primary-500 checked:bg-primary-500 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            {...props}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && <span className="text-gray-700 select-none group-hover:text-gray-900">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Radio.displayName = 'Radio';
export default Radio;