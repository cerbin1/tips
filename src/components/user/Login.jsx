import { useState } from "react";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth-context";
import SecondaryLinkButton from "../common/SecondaryLinkButton";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const { setAuthToken } = useAuth();

  function handleLogin(event) {
    event.preventDefault();

    setError();

    async function sendRequest() {
      const formData = new FormData(event.target);
      setIsLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.get("email"),
              password: formData.get("password"),
            }),
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.jwt;
          const roles = responseData.roles;
          const userEmail = responseData.userEmail;

          setAuthToken(token);
          localStorage.setItem("roles", JSON.stringify(roles));
          localStorage.setItem("userEmail", userEmail);

          navigate("/random");
        } else {
          if (response.status === 401) {
            setError("Podano nieprawidłowe dane logowania!");
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        setError("Nie udało się zalogować!");
      }
      setIsLoading(false);
    }
    sendRequest();
  }

  return (
    <ContainerSection data-testid="login-section">
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-1/3"
        aria-label="Login"
      >
        <FormInput label="Adres e-mail" id="email" type="email" required />
        <FormInput label="Hasło" id="password" type="password" required />

        <div className="flex justify-between">
          <SecondaryLinkButton
            path="/user/password-reset"
            label="Zresetuj hasło"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj"}
          </Button>
        </div>

        {error && (
          <div>
            <p className="py-6 text-red-500">{error}</p>
          </div>
        )}
      </form>
    </ContainerSection>
  );
}
