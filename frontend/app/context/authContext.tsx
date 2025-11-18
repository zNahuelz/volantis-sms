import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setAuthToken } from '~/api/httpWrapper';

interface User {
  id: string;
  email: string;
  names: string;
  surnames: string;
  store: any;
  role: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const authStore = {
  token: null as string | null,
  logout: () => {},
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => Cookies.get('AUTH_TOKEN') || null);

  const [user, setUser] = useState<User | null>(() => {
    const userCookie = Cookies.get('USER_INFO');
    return userCookie ? JSON.parse(userCookie) : null;
  });

  useEffect(() => {
    authStore.token = token;
    setAuthToken(token);
  }, [token]);

  const login = (opaqueToken: string, newUser: User, remember: boolean) => {
    setToken(opaqueToken);
    setUser(newUser);
    setAuthToken(opaqueToken);

    if (remember) {
      Cookies.set('AUTH_TOKEN', opaqueToken, { expires: 7 });
      Cookies.set('USER_INFO', JSON.stringify(newUser), { expires: 7 });
    } else {
      Cookies.set('AUTH_TOKEN', opaqueToken);
      Cookies.set('USER_INFO', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    Cookies.remove('AUTH_TOKEN');
    Cookies.remove('USER_INFO');
  };

  authStore.logout = logout;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
