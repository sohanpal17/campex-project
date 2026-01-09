const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
  };

  if (!src) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-primary-500 flex items-center justify-center text-white font-bold ${className}`}
      >
        {alt?.charAt(0).toUpperCase() || 'U'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border border-gray-200 ${className}`}
    />
  );
};

export default Avatar;