import { useState } from "react";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";
import { useNavigate } from "react-router";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);

    async function sendRequest() {
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const password = formData.get("password");
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }).then((response) => {
          if (response.ok) {
            navigate("/random");
          } else {
            throw new Error();
          }
        });
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
        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj"}
          </Button>
        </div>

        {error && <div className="py-6 text-red-500">{error}</div>}
      </form>
    </ContainerSection>
  );
}
