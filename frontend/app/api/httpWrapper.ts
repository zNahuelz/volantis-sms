import ky from "ky";
import { authStore } from "~/context/authContext";

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
};

export const http = ky.create({
  prefixUrl: "https://localhost:8000/api/v1",
  hooks: {
    beforeRequest: [
      (request) => {
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
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
