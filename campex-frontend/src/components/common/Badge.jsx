import { cn } from '@/utils/helpers';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border border-primary-300',
    accent: 'bg-accent-100 text-accent-700 border border-accent-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    danger: 'bg-red-100 text-red-700 border border-red-300',
    gray: 'bg-gray-100 text-gray-700 border border-gray-300',
    info: 'bg-blue-100 text-blue-700 border border-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;