import Button from "../common/Button";
import { useEffect, useState } from "react";
import Captcha from "../common/Captcha";
import { useAuth } from "../../store/auth-context";
import FormInput from "../common/FormInput";

export default function SuggestAdvice() {
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState();
  const [categoriesLoadingError, setCategoriesLoadingError] = useState();
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [submitFormError, setSubmitFormError] = useState();
  const [submitFormSuccess, setSubmitFormSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState();
  const { token } = useAuth();

  useEffect(() => {
    async function sendRequest() {
      setCategoriesLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/categories",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error(response);
        }
      } catch (error) {
        setCategoriesLoadingError("Nie udało się pobrać kategorii!");
      }
      setCategoriesLoading(false);
    }

    sendRequest();
  }, []);

  function handleCaptchaChange(token) {
    setCaptchaToken(token);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitFormError();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    if (name.length > 30) {
      setSubmitFormError("Nazwa jest zbyt długa!");
      return;
    }
    const content = formData.get("content");
    if (content.length > 1000) {
      setSubmitFormError("Treść jest zbyt długa!");
      return;
    }

    if (!captchaToken) {
      setSubmitFormError("Captcha nie została rozwiązana poprawnie!");
      return;
    }

    const data = Object.fromEntries(formData.entries());
    data["captchaToken"] = captchaToken;

    setSubmitFormLoading(true);
    async function sendRequest() {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices",
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
              setSubmitFormError("Wystąpił problem z walidacją Captcha!");
            } else {
              setSubmitFormError(
                "Nie udało się zapisć propozycji. Walidacja nieudana."
              );
            }
          } else {
            throw new Error(response);
          }
        }
      } catch (error) {
        setSubmitFormError("Nie udało się wysłać propozycji!");
      }
      setSubmitFormLoading(false);
    }

    sendRequest();
  }

  function handleNewAdviceSuggestion() {
    setSubmitFormSuccess(false);
  }

  return (
    <>
      <h1>Zaproponuj poradę</h1>
      {submitFormSuccess && (
        <>
          <p className="py-6 text-green-500">Propozycja została wysłana!</p>
          <Button onClick={handleNewAdviceSuggestion}>
            Zaproponuj kolejną poradę
          </Button>
        </>
      )}
      {!submitFormSuccess && (
        <form
          aria-label="SuggestAdvice"
          className="flex flex-col gap-4 text-lg w-1/3"
          method="post"
          onSubmit={handleSubmit}
        >
          <FormInput id="name" label="Nazwa porady" maxLength={30} required />
          <div className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
            <label htmlFor="category">Kategoria</label>
            {categoriesLoading && <p>Ładowanie kategorii...</p>}
            {!categoriesLoading && !categoriesLoadingError && (
              <select
                name="category"
                id="category"
                className="bg-slate-200 rounded py-2"
                data-testid="category"
                required
              >
                {categories &&
                  categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.displayName}
                    </option>
                  ))}
              </select>
            )}
            {categoriesLoadingError && (
              <p className="text-red-500">{categoriesLoadingError}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
            <label htmlFor="content">Treść</label>
            <textarea
              name="content"
              id="content"
              className="bg-slate-200 rounded py-2 px-1"
              required
              maxLength={1000}
            ></textarea>
          </div>

          <Captcha onCaptchaChange={handleCaptchaChange} />
          <Button disabled={submitFormLoading}>
            {submitFormLoading ? "Wysyłanie..." : "Wyślij propozycję"}
          </Button>
        </form>
      )}
      {submitFormError && (
        <div className="py-6 text-red-500">{submitFormError}</div>
      )}
    </>
  );
}
