import { useNavigate } from "react-router";
import Button from "./src/components/common/Button";
import ContainerSection from "./src/components/common/ContainerSection";
import FormInput from "./src/components/common/FormInput";
import { useState } from "react";

export default function RegisterUser() {
  const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    async function sendRequest() {
      setLoading(true);
      setPasswordsAreNotEqual(false);
      setError(undefined);
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      const passwordRepeat = formData.get("password-repeat");

      if (password !== passwordRepeat) {
        setPasswordsAreNotEqual(true);
        setLoading(false);
        return;
      }
      const url = import.meta.env.VITE_BACKEND_URL + "auth/register";
      const userData = { email, username, password, passwordRepeat };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          return navigate("/login");
        } else {
          if (response.status === 422) {
            const error = await response.json();
            if (error.message === "Error: Username is already taken.") {
              setError("Nazwa użytkownika jest zajęta!");
            } else if (error.message === "Error: Email is already in use.") {
              setError("Email jest zajęty!");
            }
          } else {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        setError("Nie udało się utworzyć użytkownika!");
      }

      setLoading(false);
    }
    sendRequest();
  }

  return (
    <ContainerSection data-testid="register-user-section">
      <h1>Rejestracja</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-1/3"
        aria-label="RegisterUser"
      >
        <FormInput label="Adres e-mail" id="email" type="email" required />
        <FormInput label="Nazwa użytkownika" id="username" required />
        <FormInput
          label="Hasło"
          id="password"
          type="password"
          minLength={8}
          required
        />
        <FormInput
          label="Powtórz hasło"
          id="password-repeat"
          type="password"
          minLength={8}
          required
        />
        {passwordsAreNotEqual && (
          <p className="text-red-500">Hasła muszą się zgadzać!</p>
        )}
        <div className="flex justify-between">
          <button
            className="px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
            type="reset"
            disabled={loading}
          >
            Wyczyść formularz
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </Button>
        </div>
      </form>
      {error && <div className="py-6 text-red-500">{error}</div>}
    </ContainerSection>
  );
}
