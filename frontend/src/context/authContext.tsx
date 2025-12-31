import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { setAuthToken } from '~/api/httpWrapper';
import { logoutService } from '~/features/auth/services/authService';
import type { Ability } from '~/types/ability';
import type { User } from '~/types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  abilityKeys: string[] | null;
  login: (token: string, user: User, rememberMe: boolean, abilities: Ability[]) => void;
  logout: (expiredToken?: boolean) => void;
  refreshUser: (newUser: User, abilities: Ability[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const authStore = {
  token: null as string | null,
  abilityKeys: null as string[] | null,
  logout: (expiredToken?: boolean) => {},
};

const sanitizeUserForCookie = (user: User) => {
  return {
    ...user,
    role: user.role ? { ...user.role, abilities: [] } : null,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => Cookies.get('AUTH_TOKEN') || null);
  const [abilityKeys, setAbilityKeys] = useState<string[] | null>(() => {
    const raw = Cookies.get('USER_ABILITIES');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as string[];
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
    const keys = abilities.map((a) => a.key);
    const smallUser = sanitizeUserForCookie(newUser);
    setToken(opaqueToken);
    setUser(newUser);
    setAuthToken(opaqueToken);
    setAbilityKeys(keys);

    if (remember) {
      Cookies.set('AUTH_TOKEN', opaqueToken, { expires: 7 });
      Cookies.set('USER_INFO', JSON.stringify(smallUser), { expires: 7 });
      Cookies.set('USER_ABILITIES', JSON.stringify(keys), { expires: 7 });
    } else {
      Cookies.set('AUTH_TOKEN', opaqueToken);
      Cookies.set('USER_INFO', JSON.stringify(smallUser));
      Cookies.set('USER_ABILITIES', JSON.stringify(keys));
    }
  };

  const refreshUser = (newUser: User, abilities: Ability[]) => {
    const keys = abilities.map((a) => a.key);
    const smallUser = sanitizeUserForCookie(newUser);
    setUser(newUser);
    setAbilityKeys(keys);
    Cookies.set('USER_INFO', JSON.stringify(smallUser), { expires: 7 });
    Cookies.set('USER_ABILITIES', JSON.stringify(keys), { expires: 7 });
  };

  const logout = async (expiredToken?: boolean) => {
    try {
      if (!expiredToken) {
        await logoutService();
      }
    } catch {}
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setAbilityKeys([]);
    Cookies.remove('AUTH_TOKEN');
    Cookies.remove('USER_INFO');
    Cookies.remove('USER_ABILITIES');
  };

  authStore.logout = logout;

  return (
    <AuthContext.Provider value={{ user, token, abilityKeys, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse incrustado en un  AuthProvider');
  return ctx;
};
