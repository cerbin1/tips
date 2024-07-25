import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  const [userCreateError, setUserCreateError] = useState(undefined);
  const [resendLinkLoading, setResendLinkLoading] = useState(false);
  const [resendLinkSent, setResendLinkSent] = useState(false);
  const [resendLinkError, setResendLinkError] = useState(undefined);
  const [activationLink, setActivationLink] = useState();

  function handleSubmit(event) {
    event.preventDefault();

    async function sendRequest() {
      setUserCreateLoading(true);
      setPasswordsAreNotEqual(false);
      setUserCreateError(undefined);
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      const passwordRepeat = formData.get("password-repeat");

      if (password !== passwordRepeat) {
        setPasswordsAreNotEqual(true);
        setUserCreateLoading(false);
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
          const link = await response.json();
          setActivationLink(link);
        } else {
          if (response.status === 422) {
            const error = await response.json();
            if (error.message === "Error: Username is already taken.") {
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
            throw new Error(userCreateError.message);
          }
        }
      } catch (error) {
        setUserCreateError("Nie udało się utworzyć użytkownika!");
      }

      setUserCreateLoading(false);
    }
    sendRequest();
  }

  async function resendLink() {
    setResendLinkLoading(true);
    setResendLinkError(undefined);
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "auth/resend/";
      const response = await fetch(url + activationLink, {
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
    setResendLinkLoading(false);
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
          {passwordsAreNotEqual && (
            <p className="text-red-500">Hasła muszą się zgadzać!</p>
          )}
          <div className="flex justify-between">
            <button
              className="px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
              type="reset"
              disabled={userCreateLoading}
            >
              Wyczyść formularz
            </button>
            <Button type="submit" disabled={userCreateLoading}>
              {userCreateLoading ? "Wysyłanie..." : "Wyślij"}
            </Button>
          </div>
        </form>
      )}
      {!activationLink && userCreateError && (
        <div className="py-6 text-red-500">{userCreateError}</div>
      )}

      {resendLinkError && (
        <div className="py-6 text-red-500">{resendLinkError}</div>
      )}

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
                    disabled={resendLinkLoading}
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
    </ContainerSection>
  );
}
