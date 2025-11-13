import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "features/auth/components/GuestRoute.tsx", [
    index("features/auth/views/LoginView.tsx"),
  ]),

  route("/dashboard", "features/auth/components/ProtectedRoute.tsx", [
    route("", "routes/home.tsx"),
  ]),
] satisfies RouteConfig;
