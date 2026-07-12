import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Loader } from 'lucide-react';

interface LoginPanelProps {
  onClose: () => void;
}

export function LoginPanel({ onClose }: LoginPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
      // If the email is not authorized, it will be handled by the AdminView check in App (isAdmin will be false)
    } catch (err: any) {
      console.error(err);
      setError('אירעה שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-brand-charcoal/50 hover:text-brand-charcoal transition-colors"
        >
          <ArrowRight size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-brand-cream-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32" style={{display: 'block'}}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">כניסת הנהלה</h2>
          <p className="text-brand-charcoal/60">
            התחבר עם חשבון גוגל (Google) שמורשה לנהל את המערכת ואת הגליונות (Google Sheets).
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader className="animate-spin" size={24} /> : (
              <>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>התחבר עם Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
