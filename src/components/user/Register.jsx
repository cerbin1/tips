import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/form/FormInput";
import SecondaryButton from "../common/SecondaryButton";
import RequestError from "../common/RequestError";
import ValidationError from "../common/ValidationError";
import { registerUrl, resendActivationLinkUrl } from "../../util/endpoints";

export default function Register() {
  const [userValidationError, setUserValidationError] = useState(false);
  const [userCreateSubmitting, setUserCreateSubmitting] = useState(false);
  const [userCreateError, setUserCreateError] = useState();
  const [resendLinkSubmitting, setResendLinkSubmitting] = useState(false);
  const [resendLinkSent, setResendLinkSent] = useState(false);
  const [resendLinkError, setResendLinkError] = useState();
  const [activationLink, setActivationLink] = useState();

  function handleSubmit(event) {
    event.preventDefault();

    async function sendRequest() {
      setUserCreateSubmitting(true);
      setUserValidationError();
      setUserCreateError();
      const formData = new FormData(event.target);
      const email = formData.get("email").trim();
      const username = formData.get("username").trim();
      const password = formData.get("password");
      const passwordRepeat = formData.get("password-repeat");
      if (email === "") {
        setUserValidationError("Email nie może być pusty!");
        setUserCreateSubmitting(false);
        return;
      }

      if (username === "") {
        setUserValidationError("Nazwa użytkownika nie może być pusta!");
        setUserCreateSubmitting(false);
        return;
      }

      if (password !== passwordRepeat) {
        setUserValidationError("Hasła muszą się zgadzać!");
        setUserCreateSubmitting(false);
        return;
      }

      const userData = { email, username, password, passwordRepeat };
      try {
        const response = await fetch(registerUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          const link = await response.json();
          setActivationLink(link);
        } else {
          if (response.status === 422) {
            const error = await response.json();
            if (error.message === "Error: Username is already in use.") {
              setUserCreateError("Nazwa użytkownika jest zajęta!");
            } else if (error.message === "Error: Email is already in use.") {
              setUserCreateError("Email jest zajęty!");
            } else if (error.message === "Error: Email is not valid.") {
              setUserCreateError("Email jest niepoprawny!");
            } else if (error.message === "Error: Password is not valid.") {
              setUserCreateError(
                "Hasło jest niepoprawne. Pole musi mieć conajmniej 8 znaków, przynajmniej jedną cyfrę, literę i znak specjalny."
              );
            } else if (error.message === "Error: Passwords do not match.") {
              setUserCreateError("Hasła musza być takie same!");
            }
          } else {
            throw new Error(response);
          }
        }
      } catch (error) {
        setUserCreateError("Nie udało się utworzyć użytkownika!");
      }

      setUserCreateSubmitting(false);
    }
    sendRequest();
  }

  async function resendLink() {
    setResendLinkSubmitting(true);
    setResendLinkError();
    try {
      const response = await fetch(resendActivationLinkUrl(activationLink), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setResendLinkSent(true);
      } else {
        throw new Error();
      }
    } catch (error) {
      setResendLinkError("Nie udało się ponownie wysłać linka!");
    }
    setResendLinkSubmitting(false);
  }

  return (
    <ContainerSection data-testid="register-user-section">
      <h1>Rejestracja</h1>
      {!activationLink && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-1/3"
          aria-label="Register"
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
          <div className="flex justify-between">
            <SecondaryButton type="reset" disabled={userCreateSubmitting}>
              Wyczyść formularz
            </SecondaryButton>
            <Button type="submit" disabled={userCreateSubmitting}>
              {userCreateSubmitting ? "Wysyłanie..." : "Wyślij"}
            </Button>
          </div>
          <ValidationError content={userValidationError} />
        </form>
      )}
      <RequestError content={userCreateError} />

      {activationLink && !resendLinkError && (
        <>
          <div className="my-4 py-2 px-8 border border-cyan-200 radius-2xl text-green-600 leading-loose">
            {resendLinkSent && <p>Link został wysłany ponownie.</p>}
            {!resendLinkSent && (
              <>
                <p>Rejestracja przebiegła pomyślnie.</p>
                <p>Na Twój adres e-mail został wysłany link aktywacyjny.</p>
                <p>Link wygaśnie po 15 minutach.</p>
                <p>
                  <button
                    onClick={resendLink}
                    className="text-blue-to-dark underline"
                    disabled={resendLinkSubmitting}
                  >
                    Kliknij tutaj
                  </button>{" "}
                  jeśli chcesz wysłać ponownie link.
                </p>
              </>
            )}
          </div>
          <Button>
            <Link to="/login">Przejdź do logowania</Link>
          </Button>
        </>
      )}
      <RequestError content={resendLinkError} />
    </ContainerSection>
  );
}
