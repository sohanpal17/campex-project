import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailOpen, RefreshCw, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function EmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleVerify = () => {
    // API Verification Logic
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
            <MailOpen size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your Inbox</h2>
          <p className="text-gray-600 mt-2">
            We sent a verification code to <span className="font-semibold text-gray-900">student@ves.ac.in</span>
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              />
            ))}
          </div>

          <Button onClick={handleVerify} className="w-full h-12 text-lg mb-6">
            Verify Email <ArrowRight size={18} className="ml-2" />
          </Button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-mono font-medium">{timer}s</span>
              </p>
            ) : (
              <button 
                onClick={() => setTimer(30)}
                className="flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium mx-auto text-sm"
              >
                <RefreshCw size={16} /> Resend Verification Code
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}