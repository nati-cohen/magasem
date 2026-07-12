import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  accessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_EMAILS = ['netanel095@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('google_access_token');
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        setAccessToken(null);
        localStorage.removeItem('google_access_token');
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        localStorage.setItem('google_access_token', credential.accessToken);
      }
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAccessToken(null);
    localStorage.removeItem('google_access_token');
  };

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, accessToken, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
