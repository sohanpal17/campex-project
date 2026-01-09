import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  placeholder,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  value,
  onChange,
  ...props
}, ref) => {
  // For character count, use value prop if provided, otherwise try to get from ref
  const displayValue = value !== undefined ? value : '';
  const charCount = displayValue.length;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        <div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        {showCount && maxLength && (
          <p className="text-sm text-gray-500">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;