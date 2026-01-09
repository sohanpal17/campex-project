const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseStyles = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'h-full w-full',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
};

export default Skeleton;