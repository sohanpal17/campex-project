import { getPasswordStrength } from '@/utils/validators';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { strength, label, color, textColor } = getPasswordStrength(password);

  if (strength === 'none') return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${color}`}
            style={{
              width:
                strength === 'weak'
                  ? '33%'
                  : strength === 'medium'
                  ? '66%'
                  : '100%',
            }}
          />
        </div>
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      </div>
    </div>
  );
};

export default PasswordStrength;