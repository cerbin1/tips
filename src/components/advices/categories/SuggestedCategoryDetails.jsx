import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../../store/auth-context";
import { getUserEmail } from "../../../util/auth";
import Button from "../../common/Button";
import ContainerSection from "../../common/ContainerSection";
import Loader from "../../common/Loader";
import RequestError from "../../common/RequestError";
import SecondaryButton from "../../common/SecondaryButton";
import {
  getSuggestedCategoryDetailsUrl,
  getUserVotedSuggestedCategoryInfoUrl,
  voteSuggestedCategoryUrl,
} from "../../../util/endpoints";

export default function SuggestedCategoryDetails() {
  const [details, setDetails] = useState();
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState();
  const [userVoted, setUserVoted] = useState();
  const [userVotedError, setUserVotedError] = useState();
  const [voteCategoryError, setVoteCategoryError] = useState();
  const [voteCategoryUpLoading, setVoteCategoryUpLoading] = useState(false);
  const [voteCategoryUp, setVoteCategoryUp] = useState(false);
  const [voteCategoryDownLoading, setVoteCategoryDownLoading] = useState(false);
  const [voteCategoryDown, setVoteCategoryDown] = useState(false);
  const [voteCategorySuccess, setVoteCategorySuccess] = useState();
  const { id } = useParams();
  const { token } = useAuth();

  async function handleVoteCategoryUp() {
    setVoteCategoryError();
    setVoteCategoryUpLoading(true);
    const response = await sendVoteCategoryRequest(true);
    if (response.ok) {
      setVoteCategoryUp(true);
      const category = await response.json();
      setDetails(category);
      setVoteCategorySuccess("Ocena podwyższona pomyślnie.");
    } else {
      setVoteCategoryError("Nie udało się ocenić kategorii!");
    }
    setVoteCategoryUpLoading(false);
  }

  async function handleVoteCategoryDown() {
    setVoteCategoryError();
    setVoteCategoryUpLoading(true);
    const response = await sendVoteCategoryRequest(false);
    if (response.ok) {
      setVoteCategoryDown(true);
      const category = await response.json();
      setDetails(category);
      setVoteCategorySuccess("Ocena obniżona pomyślnie.");
    } else {
      setVoteCategoryError("Nie udało się ocenić kategorii!");
    }
    setVoteCategoryUpLoading(false);
  }

  async function sendVoteCategoryRequest(voteType) {
    try {
      const response = await fetch(voteSuggestedCategoryUrl(id, voteType), {
        method: "POST",
        body: getUserEmail(),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response;
    } catch (error) {
      setVoteCategoryError("Nie udało się ocenić kategorii!");
    }
  }

  useEffect(() => {
    async function fetchSuggestedCategoryDetails() {
      setDetailsError();
      try {
        const response = await fetch(getSuggestedCategoryDetailsUrl(id));
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

    async function fetchUserVotedCategory() {
      setUserVotedError();
      const response = await fetch(
        getUserVotedSuggestedCategoryInfoUrl(id, getUserEmail()),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setUserVoted(responseData.voted);
      } else {
        setUserVotedError("Nie udało się pobrać informacji o głosowaniu!");
      }
    }

    async function fetchDetails() {
      setDetailsLoading(true);
      await fetchSuggestedCategoryDetails();
      await fetchUserVotedCategory();
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
                  voteCategoryDownLoading ||
                  voteCategoryDown ||
                  voteCategorySuccess
                }
                onClick={handleVoteCategoryDown}
              >
                {voteCategoryDownLoading
                  ? "Wysyłanie oceny..."
                  : voteCategoryDown
                  ? "Oceniono"
                  : "Oceń jako nieprzydatne"}
              </SecondaryButton>
              <Button
                onClick={handleVoteCategoryUp}
                disabled={
                  voteCategoryUpLoading || voteCategoryUp || voteCategorySuccess
                }
              >
                {voteCategoryUpLoading
                  ? "Wysyłanie oceny..."
                  : voteCategoryUp
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
      <RequestError content={voteCategoryError} />
      {voteCategorySuccess && (
        <p className="py-6 text-green-500">{voteCategorySuccess}</p>
      )}
    </ContainerSection>
  );
}
