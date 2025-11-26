import { http } from '~/api/httpWrapper';
import type { User } from '~/types/user';

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

export const profileService = async () => {
  return http.get('auth/profile').json<User>();
};

export const updateEmailService = async (newEmail: string) => {
  return http
    .post('auth/update-email', { json: { newEmail } })
    .json<{ message: string; email: string }>();
};

export const updatePasswordService = async (oldPassword: string, newPassword: string) => {
  return http
    .post('auth/update-password', { json: { oldPassword: oldPassword, newPassword: newPassword } })
    .json<{ message: string }>();
};
