import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth-context";
import Button from "../common/Button";
import Captcha from "../common/form/Captcha";
import FormInput from "../common/form/FormInput";
import RequestError from "../common/RequestError";
import Loader from "../common/Loader";
import {
  createSuggestedAdviceUrl,
  getAvailableCategoriesUrl,
} from "../../util/endpoints";

export default function SuggestAdvice() {
  const [categories, setCategories] = useState();
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [submitFormError, setSubmitFormError] = useState();
  const [submitFormSuccess, setSubmitFormSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState();
  const { token } = useAuth();

  useEffect(() => {
    async function sendRequest() {
      setCategoriesLoading(true);
      try {
        const response = await fetch(getAvailableCategoriesUrl(), {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error(response);
        }
      } catch (error) {
        setCategoriesError("Nie udało się pobrać kategorii!");
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

    setSubmitting(true);
    async function sendRequest() {
      try {
        const response = await fetch(createSuggestedAdviceUrl(), {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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
      setSubmitting(false);
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
            {categoriesLoading && <Loader />}
            {!categoriesLoading && !categoriesError && (
              <select
                name="category"
                id="category"
                className="bg-slate-200 rounded py-2"
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
            <RequestError content={categoriesError} />
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
          <FormInput id="source" label="Źródło" maxLength={200} />

          <Captcha onCaptchaChange={handleCaptchaChange} />
          <Button disabled={submitting}>
            {submitting ? "Wysyłanie..." : "Wyślij propozycję"}
          </Button>
        </form>
      )}
      <RequestError content={submitFormError} />
    </>
  );
}
