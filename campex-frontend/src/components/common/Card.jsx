const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;