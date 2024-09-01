import { useState } from "react";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/form/FormInput";
import { useNavigate, useParams } from "react-router";

export default function PasswordChangeForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { token } = useParams();

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    if (password.length < 8) {
      setError(
        "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
      );
      return;
    }

    async function sendRequest() {
      const url =
        import.meta.env.VITE_BACKEND_URL +
        "auth/account/password-change/" +
        token;

      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: password,
        });

        if (response.ok) {
          navigate("/user/login");
        } else {
          if (response.status === 422) {
            const responseData = await response.json();
            if (responseData.message === "Error: Link expired.") {
              setError("Nie udało się zmienić hasła! Link wygasł.");
            } else {
              setError(
                "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
              );
            }
          } else {
            throw new Error(response);
          }
        }
      } catch (error) {
        setError("Nie udało się zmienić hasła!");
      }
      setLoading(false);
    }
    sendRequest();
  }

  return (
    <ContainerSection data-testid="password-change-section">
      <h1>Zmiana hasła</h1>
      <form
        aria-label="Zmiana hasła"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-1/3"
      >
        <FormInput
          label="Nowe hasło"
          id="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </form>
      {error && <div className="py-6 text-red-500">{error}</div>}
    </ContainerSection>
  );
}
