import { http } from "~/api/httpWrapper";

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  return http.post("auth/login", { json: data }).json<{
    token: string;
    user: any;
  }>();
};
