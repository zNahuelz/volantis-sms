import type { Route } from '.react-router/types/app/+types/root';
import { LoginAreaText, LoginText } from '~/constants/strings';
import appIcon from '../../../../assets/images/volantisIconTransparent.png';
import LoginForm from '../components/LoginForm';

export function meta({}: Route.MetaArgs) {
  return [{ title: LoginAreaText }];
}

export default function LoginView() {
  return (
    <div className="bg-secondary/10 flex min-h-screen flex-col items-center justify-center">
      <div className="card bg-base-100 flex w-100 flex-col p-6 shadow-xl">
        <h1 className="text-center text-xl font-bold">{LoginText}</h1>
        <div className="mt-2 flex flex-col items-center">
          <img alt="Volantis Logo" src={appIcon} className="h-25 w-20" />
        </div>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}
