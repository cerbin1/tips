import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../store/auth-context";
import { getUserEmail } from "../../../util/auth";
import Button from "../../common/Button";
import ContainerSection from "../../common/ContainerSection";
import Loader from "../../common/Loader";
import RequestError from "../../common/RequestError";
import SecondaryButton from "../../common/SecondaryButton";

export default function SuggestedCategoryDetails() {
  const [details, setDetails] = useState();
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState();
  const [userVoted, setUserVoted] = useState();
  const [userVotedError, setUserVotedError] = useState();
  const [rateCategoryError, setRateCategoryError] = useState();
  const [rateCategoryUpLoading, setRateCategoryUpLoading] = useState(false);
  const [rateCategoryUp, setRateCategoryUp] = useState(false);
  const [rateCategoryDownLoading, setRateCategoryDownLoading] = useState(false);
  const [rateCategoryDown, setRateCategoryDown] = useState(false);
  const [rateCategorySuccess, setRateCategorySuccess] = useState();
  const { id } = useParams();
  const { token } = useAuth();

  async function handleRateCategoryUp() {
    setRateCategoryError();
    setRateCategoryUpLoading(true);
    const response = await sendRateCategoryRequest(true);
    if (response.ok) {
      setRateCategoryUp(true);
      const category = await response.json();
      setDetails(category);
      setRateCategorySuccess("Ocena podwyższona pomyślnie.");
    } else {
      setRateCategoryError("Nie udało się ocenić kategorii!");
    }
    setRateCategoryUpLoading(false);
  }

  async function handleRateCategoryDown() {
    setRateCategoryError();
    setRateCategoryUpLoading(true);
    const response = await sendRateCategoryRequest(false);
    if (response.ok) {
      setRateCategoryDown(true);
      const category = await response.json();
      setDetails(category);
      setRateCategorySuccess("Ocena obniżona pomyślnie.");
    } else {
      setRateCategoryError("Nie udało się ocenić kategorii!");
    }
    setRateCategoryUpLoading(false);
  }

  async function sendRateCategoryRequest(rateUp) {
    const url =
      import.meta.env.VITE_BACKEND_URL +
      "categories/suggested/" +
      id +
      "/rate?rateType=" +
      rateUp;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: getUserEmail(),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response;
    } catch (error) {
      setRateCategoryError("Nie udało się ocenić kategorii!");
    }
  }

  useEffect(() => {
    async function fetchSuggestedCategoryDetails() {
      setDetailsError();
      const url =
        import.meta.env.VITE_BACKEND_URL + "advices/categories/suggested/" + id;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const categoryDetails = await response.json();
          setDetails(categoryDetails);
        } else {
          if (response.status === 404) {
            setDetailsError("Nie znaleziono kategorii!");
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        setDetailsError("Nie udało się wyświetlić kategorii!");
      }
    }

    async function fetchUserRatedCategory() {
      setUserVotedError();
      const url =
        import.meta.env.VITE_BACKEND_URL +
        "categories/suggested/" +
        id +
        "/rated?userEmail=" +
        getUserEmail();
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setUserVoted(responseData.rated);
      } else {
        setUserVotedError("Nie udało się pobrać informacji o głosowaniu!");
      }
    }

    async function fetchDetails() {
      setDetailsLoading(true);
      await fetchSuggestedCategoryDetails();
      await fetchUserRatedCategory();
      setDetailsLoading(false);
    }

    fetchDetails();
  }, [id]);

  return (
    <ContainerSection data-testid="suggested-category-details">
      {detailsLoading && <Loader />}

      {!detailsLoading && details && (
        <>
          <h1>{details.name}</h1>
          <div className="py-6">
            <p>Ocena przydatności:</p>
            <p className="text-sky-500 text-lg">{details.rating}</p>
          </div>

          {token && !userVoted && (
            <div className="flex gap-4">
              <SecondaryButton
                disabled={
                  rateCategoryDownLoading ||
                  rateCategoryDown ||
                  rateCategorySuccess
                }
                onClick={handleRateCategoryDown}
              >
                {rateCategoryDownLoading
                  ? "Wysyłanie oceny..."
                  : rateCategoryDown
                  ? "Oceniono"
                  : "Oceń jako nieprzydatne"}
              </SecondaryButton>
              <Button
                onClick={handleRateCategoryUp}
                disabled={
                  rateCategoryUpLoading || rateCategoryUp || rateCategorySuccess
                }
              >
                {rateCategoryUpLoading
                  ? "Wysyłanie oceny..."
                  : rateCategoryUp
                  ? "Oceniono"
                  : "Oceń jako przydatne"}
              </Button>
            </div>
          )}
          {!token && <p className="py-6">Zaloguj się aby zagłosować</p>}
          {token && userVoted && <p>Oceniono kategorię.</p>}
        </>
      )}
      <RequestError content={detailsError} />
      <RequestError content={userVotedError} />
      <RequestError content={rateCategoryError} />
      {rateCategorySuccess && (
        <p className="py-6 text-green-500">{rateCategorySuccess}</p>
      )}
    </ContainerSection>
  );
}
