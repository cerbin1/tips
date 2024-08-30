import { useState } from "react";
import Button from "../../common/Button";
import Captcha from "../../common/Captcha";
import FormInput from "../../common/FormInput";
import { useAuth } from "../../../store/auth-context";

export default function SuggestCategory() {
  const [captchaToken, setCaptchaToken] = useState();
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFormSuccess, setSubmitFormSuccess] = useState(false);
  const { token } = useAuth();

  function handleCaptchaChange(token) {
    setCaptchaToken(token);
  }
  function handleSubmit(event) {
    event.preventDefault();
    setError();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    if (name.length > 100) {
      setError("Nazwa jest zbyt długa!");
      return;
    }
    if (!captchaToken) {
      setError("Captcha nie została rozwiązana poprawnie!");
      return;
    }

    const data = Object.fromEntries(formData.entries());
    data["captchaToken"] = captchaToken;

    setIsSubmitting(true);
    async function sendRequest() {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "categories",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          setSubmitFormSuccess(true);
        } else {
          const responseError = await response.json();
          if (response.status === 422) {
            if (responseError.message === "Error: captcha is not valid.") {
              setError("Wystąpił problem z walidacją Captcha!");
            } else {
              setError("Nie udało się zapisć propozycji. Walidacja nieudana.");
            }
          } else {
            throw new Error(response);
          }
        }
      } catch (error) {
        setError("Nie udało się wysłać propozycji!");
      }
      setIsSubmitting(false);
    }

    sendRequest();
  }

  function handleNewCategorySuggestion() {
    setSubmitFormSuccess(false);
  }

  return (
    <>
      <h1>Zaproponuj kategorię</h1>
      {submitFormSuccess && (
        <>
          <p className="py-6 text-green-500">Propozycja została wysłana!</p>
          <Button onClick={handleNewCategorySuggestion}>
            Zaproponuj kolejną kategorię
          </Button>
        </>
      )}
      {!submitFormSuccess && (
        <form
          aria-label="SuggestCategory"
          className="flex flex-col gap-4 text-lg w-1/3"
          onSubmit={handleSubmit}
        >
          <FormInput id="name" label="Nazwa kategorii" />
          <Captcha onCaptchaChange={handleCaptchaChange} />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Wysyłanie..." : "Wyślij propozycję"}
          </Button>
        </form>
      )}
      {error && <div className="py-6 text-red-500">{error}</div>}
    </>
  );
}