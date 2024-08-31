import { useState } from "react";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";

export default function PasswordResetForm() {
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [submitFormSuccess, setSubmitFormSuccess] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    setError();
    setLoading(true);
    async function sendRequest() {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            "auth/account/password-reset?email=" +
            email,
          { method: "PUT" }
        );
        if (response.ok) {
          setSubmitFormSuccess(true);
        } else {
          throw new Error(response);
        }
      } catch (error) {
        setError("Nie udało się wysłać linku resetującego hasło!");
      }
      setLoading(false);
    }

    sendRequest();
  }
  return (
    <ContainerSection data-testid="password-reset-section">
      <h1>Resetuj hasło</h1>
      {!submitFormSuccess && (
        <form
          className="flex flex-col gap-4 text-lg w-1/3"
          onSubmit={handleSubmit}
          aria-label="Reset Password"
        >
          <FormInput
            label="Adres e-mail"
            id="email"
            onChange={handleChange}
            type="email"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </Button>
        </form>
      )}
      {error && <p className="py-6 text-red-500">{error}</p>}

      {submitFormSuccess && (
        <p className="py-6 text-green-500">
          Link do resetowania hasła został wysłany.
        </p>
      )}
    </ContainerSection>
  );
}
