import ky from 'ky';
import { authStore } from '~/context/authContext';
import type { ApiError } from '~/types/apiError';
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
      async (_request, _options, response) => {
        if (response.status === 401) {
          authStore.logout();
        }

        if (!response.ok) {
          let body: ApiError | null = null;

          try {
            body = await response.json<ApiError>();
          } catch (_) {
            body = null;
          }

          throw {
            status: response.status,
            message: body?.message ?? 'Unexpected error',
            errors: body?.errors ?? null,
          };
        }
      },
    ],
  },
});
