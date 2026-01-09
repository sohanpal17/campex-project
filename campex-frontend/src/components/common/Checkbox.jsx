import { forwardRef } from 'react';

const Checkbox = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-primary-500 checked:bg-primary-500 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            {...props}
          />
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-0 peer-checked:opacity-100 text-white transition-opacity"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {label && <span className="text-gray-700 select-none group-hover:text-gray-900">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;