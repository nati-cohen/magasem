import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Loader, Mail, Key, AlertCircle } from 'lucide-react';

interface LoginPanelProps {
  onClose: () => void;
}

export function LoginPanel({ onClose }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { sendOtp, verifyOtp } = useAuth();

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('אנא הזן כתובת אימייל');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await sendOtp(email);
      setStep('code');
      setSuccessMsg('קוד האימות נשלח בהצלחה לתיבת המייל שלך!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'אירעה שגיאה בשליחת קוד האימות. ודא שכתובת ה-Apps Script מוגדרת נכון.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('אנא הזן את קוד האימות');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isSuccess = await verifyOtp(email, code);
      if (!isSuccess) {
        setError('קוד אימות שגוי או פג תוקף');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'אירעה שגיאה באימות הקוד.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-brand-charcoal/50 hover:text-brand-charcoal transition-colors"
          title="חזרה לאתר"
        >
          <ArrowRight size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-brand-cream-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-olive">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">כניסת הנהלה מאובטחת</h2>
          <p className="text-brand-charcoal/60 text-sm">
            הזן את המייל המורשה שלך לקבלת קוד אימות חד-פעמי (OTP) ישירות לתיבת המייל.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <p className="mb-6 text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 text-sm font-medium">
            {successMsg}
          </p>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                כתובת אימייל מורשית
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-4 pr-11 py-3 border border-brand-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-olive"
                  required
                />
                <Mail className="absolute right-4 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-olive text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand-olive-light transition-colors flex justify-center items-center gap-3 disabled:opacity-70 shadow-sm"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'שלח קוד אימות'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-bold text-gray-700 mb-2">
                קוד אימות בן 6 ספרות
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------"
                  className="w-full text-center tracking-[1em] font-mono text-xl py-3 border border-brand-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-olive"
                  required
                />
                <Key className="absolute right-4 top-4 text-gray-400" size={18} />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                לא קיבלת?{' '}
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-brand-olive font-bold hover:underline"
                >
                  לחץ כאן כדי לשלוח שוב
                </button>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-olive text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand-olive-light transition-colors flex justify-center items-center gap-3 disabled:opacity-70 shadow-sm"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'התחבר למערכת'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
