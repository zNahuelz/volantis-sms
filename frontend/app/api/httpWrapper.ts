import ky from 'ky';
import { authStore } from '~/context/authContext';
const API_URL = import.meta.env.VITE_API_URL;

export const setAuthToken = (newToken: string | null) => {
  authStore.token = newToken;
};

export const http = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        if (authStore.token) {
          request.headers.set('Authorization', `Bearer ${authStore.token}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          authStore.logout();
        }
      },
    ],
  },
});
