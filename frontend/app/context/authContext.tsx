import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setAuthToken } from '~/api/httpWrapper';
import { logoutService } from '~/features/auth/services/authService';
import type { Ability } from '~/types/ability';
import type { User } from '~/types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  abilities: Ability[] | null;
  login: (token: string, user: User, rememberMe: boolean, abilities: Ability[]) => void;
  logout: () => void;
  refreshUser: (newUser: User, abilities: Ability[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const authStore = {
  token: null as string | null,
  abilities: null as Ability[] | null,
  logout: () => {},
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => Cookies.get('AUTH_TOKEN') || null);
  const [abilities, setAbilities] = useState<Ability[] | null>(() => {
    const raw = Cookies.get('USER_ABILITIES');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Ability[];
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    const userCookie = Cookies.get('USER_INFO');
    return userCookie ? JSON.parse(userCookie) : null;
  });

  useEffect(() => {
    authStore.token = token;
    setAuthToken(token);
  }, [token]);

  const login = (opaqueToken: string, newUser: User, remember: boolean, abilities: Ability[]) => {
    setToken(opaqueToken);
    setUser(newUser);
    setAuthToken(opaqueToken);
    setAbilities(abilities);

    if (remember) {
      Cookies.set('AUTH_TOKEN', opaqueToken, { expires: 7 });
      Cookies.set('USER_INFO', JSON.stringify(newUser), { expires: 7 });
      Cookies.set('USER_ABILITIES', JSON.stringify(abilities), { expires: 7 });
    } else {
      Cookies.set('AUTH_TOKEN', opaqueToken);
      Cookies.set('USER_INFO', JSON.stringify(newUser));
      Cookies.set('USER_ABILITIES', JSON.stringify(abilities));
    }
  };

  const refreshUser = (newUser: User, abilities: Ability[]) => {
    setUser(newUser);
    setAbilities(abilities);
    Cookies.set('USER_INFO', JSON.stringify(newUser), { expires: 7 });
    Cookies.set('USER_ABILITIES', JSON.stringify(abilities), { expires: 7 });
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch {}
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setAbilities([]);
    Cookies.remove('AUTH_TOKEN');
    Cookies.remove('USER_INFO');
    Cookies.remove('USER_ABILITIES');
  };

  authStore.logout = logout;

  return (
    <AuthContext.Provider value={{ user, token, abilities, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
