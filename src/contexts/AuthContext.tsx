import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAppsScriptUrl } from '../services/menu';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_EMAILS = ['netanel095@gmail.com', 'yaara82@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const sendOtp = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      throw new Error('כתובת אימייל זו אינה מורשית גישה למערכת הניהול.');
    }

    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      throw new Error('כתובת ה-Apps Script אינה מוגדרת.');
    }

    const res = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'sendOtp',
        email: cleanEmail
      })
    });

    if (!res.ok) {
      throw new Error('שגיאה בתקשורת עם שרת ה-Apps Script. ודא שהכתובת נכונה.');
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
  };

  const verifyOtp = async (email: string, code: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const scriptUrl = getAppsScriptUrl();
    if (!scriptUrl) {
      throw new Error('כתובת ה-Apps Script אינה מוגדרת.');
    }

    const res = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'verifyOtp',
        email: cleanEmail,
        code: code.trim()
      })
    });

    if (!res.ok) {
      throw new Error('שגיאה בתקשורת עם שרת ה-Apps Script.');
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    if (data.success) {
      const newUser = { email: cleanEmail };
      setUser(newUser);
      localStorage.setItem('admin_user', JSON.stringify(newUser));
      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

