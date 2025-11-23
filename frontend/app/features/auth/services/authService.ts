import { http } from '~/api/httpWrapper';

export const loginService = async (data: {
  username: string;
  password: string;
  rememberMe: boolean;
}) => {
  return http.post('auth/login', { json: data }).json<{
    token: {
      type: string;
      token: string;
      abilities: string[];
      expiresAt: string | null;
    };
    user: any;
  }>();
};

export const logoutService = async () => {
  return http.post('auth/logout').json<{ message: string }>();
};
