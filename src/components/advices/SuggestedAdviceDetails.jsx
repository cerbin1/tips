import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../store/auth-context";
import { getUserEmail } from "../../util/auth";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import Loader from "../common/Loader";
import RequestError from "../common/RequestError";
import SecondaryButton from "../common/SecondaryButton";

export default function SuggestedAdviceDetails() {
  const [suggestedAdviceDetails, setSuggestedAdviceDetails] = useState();
  const [suggestedAdviceDetailsLoading, setSuggestedAdviceDetailsLoading] =
    useState(false);
  const [suggestedAdviceDetailsError, setSuggestedAdviceDetailsError] =
    useState();
  const [userVoted, setUserVoted] = useState();
  const [userVotedError, setUserVotedError] = useState();
  const [rateAdviceError, setRateAdviceError] = useState();
  const [rateAdviceUpLoading, setRateAdviceUpLoading] = useState(false);
  const [rateAdviceUp, setRateAdviceUp] = useState(false);
  const [rateAdviceSuccess, setRateAdviceSuccess] = useState();
  const [rateAdviceDownLoading, setRateAdviceDownLoading] = useState(false);
  const [rateAdviceDown, setRateAdviceDown] = useState(false);
  const { token } = useAuth();
  const { id } = useParams();

  async function handleRateAdviceUp() {
    setRateAdviceError();
    setRateAdviceUpLoading(true);
    const response = await sendRateAdviceRequest(true);
    if (response.ok) {
      setRateAdviceUp(true);
      const advice = await response.json();
      setSuggestedAdviceDetails(advice);
      setRateAdviceSuccess("Ocena podwyższona pomyślnie.");
    } else {
      setRateAdviceError("Nie udało się ocenić porady!");
    }
    setRateAdviceUpLoading(false);
  }

  async function handleRateAdviceDown() {
    setRateAdviceError();
    setRateAdviceDownLoading(true);
    const response = await sendRateAdviceRequest(false);
    if (response.ok) {
      setRateAdviceDown(true);
      const advice = await response.json();
      setSuggestedAdviceDetails(advice);
      setRateAdviceSuccess("Ocena obniżona pomyślnie.");
    } else {
      setRateAdviceError("Nie udało się ocenić porady!");
    }
    setRateAdviceDownLoading(false);
  }

  async function sendRateAdviceRequest(rateUp) {
    const url =
      import.meta.env.VITE_BACKEND_URL +
      "advices/suggested/" +
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
      setRateAdviceError("Nie udało się ocenić porady!");
    }
  }

  useEffect(() => {
    async function fetchSuggestedAdviceDetails() {
      setSuggestedAdviceDetailsError();
      const url = import.meta.env.VITE_BACKEND_URL + "advices/suggested/" + id;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const advice = await response.json();
          setSuggestedAdviceDetails(advice);
        } else {
          if (response.status === 404) {
            setSuggestedAdviceDetailsError("Nie znaleziono porady!");
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        setSuggestedAdviceDetailsError("Nie udało się wyświetlić porady!");
      }
    }

    async function fetchUserRatedAdvice() {
      setUserVotedError();
      const url =
        import.meta.env.VITE_BACKEND_URL +
        "advices/suggested/" +
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
      setSuggestedAdviceDetailsLoading(true);
      await fetchSuggestedAdviceDetails();
      await fetchUserRatedAdvice();
      setSuggestedAdviceDetailsLoading(false);
    }

    fetchDetails();
  }, [id]);
  return (
    <ContainerSection data-testid="suggested-advice-details">
      {suggestedAdviceDetailsLoading && <Loader />}
      {!suggestedAdviceDetailsLoading && suggestedAdviceDetails && (
        <>
          <h1>{suggestedAdviceDetails.name}</h1>
          <h2 className="py-6 cursor-default">
            Kategoria:
            <p className="text-sky-500 text-lg ">
              {suggestedAdviceDetails.categoryDisplayName}
            </p>
          </h2>
          <p className="border border-sky-500 rounded py-6 px-6">
            {suggestedAdviceDetails.content}
          </p>
          <div className="py-6">
            <p>Ocena przydatności:</p>
            <p className="text-sky-500 text-lg">
              {suggestedAdviceDetails.rating}
            </p>
          </div>

          {token && userVoted && <p>Oceniono poradę.</p>}
          {token && !userVoted && (
            <div className="flex gap-4">
              <SecondaryButton
                disabled={
                  rateAdviceDownLoading || rateAdviceDown || rateAdviceSuccess
                }
                onClick={handleRateAdviceDown}
              >
                {rateAdviceDownLoading
                  ? "Wysyłanie oceny..."
                  : rateAdviceDown
                  ? "Oceniono"
                  : "Oceń jako nieprzydatne"}
              </SecondaryButton>
              <Button
                onClick={handleRateAdviceUp}
                disabled={
                  rateAdviceUpLoading || rateAdviceUp || rateAdviceSuccess
                }
              >
                {rateAdviceUpLoading
                  ? "Wysyłanie oceny..."
                  : rateAdviceUp
                  ? "Oceniono"
                  : "Oceń jako przydatne"}
              </Button>
            </div>
          )}
          {!token && <p className="py-6">Zaloguj się aby zagłosować</p>}
        </>
      )}
      <RequestError content={suggestedAdviceDetailsError} />
      <RequestError content={userVotedError} />
      <RequestError content={rateAdviceError} />
      {rateAdviceSuccess && (
        <p className="py-6 text-green-500">{rateAdviceSuccess}</p>
      )}
    </ContainerSection>
  );
}
