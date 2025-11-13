import type { Route } from ".react-router/types/app/+types/root";
import { LoginText } from "~/constants/strings";
import appIcon from "../../../../assets/images/volantisIconTransparent.png";
import LoginForm from "../components/LoginForm";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Inicio de Sesión - Volantis" }];
}

export default function LoginView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/10">
      <div className="card w-100 bg-base-100 p-6 shadow-xl flex flex-col">
        <h1 className="text-center text-xl font-bold">{LoginText}</h1>
        <div className="mt-2 flex flex-col items-center">
          <img alt="Volantis Logo" src={appIcon} className="h-25 w-20" />
        </div>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}
