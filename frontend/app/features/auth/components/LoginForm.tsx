import Button from "~/components/Button";
import Input from "~/components/Input";
import { EmailIcon, PasswordIcon } from "~/constants/iconNames";
import { EmailText, LoginButtonText, PasswordText } from "~/constants/strings";
import { useForm } from "react-hook-form";
import { loginService } from "../services/authService";
import { useAuth } from "~/context/authContext";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await loginService(data);
      login(res.token, res.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError("email", { message: "Credenciales incorrectas" });
      setError("password", { message: "Credenciales incorrectas" });
    }
  };

  return (
    <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Input
        width="w-full"
        icon={EmailIcon}
        placeholder={EmailText}
        error={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email", {
          required: "Debe ingresar un correo electrónico.",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message:
              "Debe ingresar un correo electrónico con el formato email@dominio.com",
          },
        })}
      />
      <Input
        width="w-full"
        icon={PasswordIcon}
        placeholder={PasswordText}
        type="password"
        error={!!errors.password}
        errorMessage={errors.password?.message}
        {...register("password", {
          required: "Debe ingresar una contraseña.",
          minLength: {
            value: 5,
            message: "La contraseña debe tener al menos 5 carácteres.",
          },
        })}
      />
      <div className="flex flex-col items-center">
        <Button label={LoginButtonText} type="submit" />
      </div>
    </form>
  );
}
