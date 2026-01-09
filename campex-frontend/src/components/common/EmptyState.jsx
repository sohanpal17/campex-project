const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action, 
  imageSrc 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {imageSrc ? (
        <img src={imageSrc} alt="Empty" className="w-48 h-48 mb-6 opacity-80" />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
          {icon || '🔍'}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;