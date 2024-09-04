import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../store/auth-context";
import { getUserEmail } from "../../util/auth";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";

export default function AdviceDetails() {
  const [adviceDetails, setAdviceDetails] = useState();
  const [adviceDetailsloading, setAdviceDetailsloading] = useState(false);
  const [adviceDetailsError, setAdviceDetailsError] = useState();
  const [rateAdviceLoading, setRateAdviceLoading] = useState(false);
  const [rateAdviceError, setRateAdviceError] = useState();
  const [rateAdviceSuccess, setRateAdviceSuccess] = useState();
  const [userVoted, setUserVoted] = useState(false);
  const [userVotedError, setUserVotedError] = useState();
  const { adviceId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchAdvice() {
      setAdviceDetailsError();
      const url = import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const advice = await response.json();
          setAdviceDetails(advice);
        } else {
          if (response.status === 404) {
            setAdviceDetailsError("Nie znaleziono porady!");
          } else {
            setAdviceDetailsError("Nie udało się wyświetlić porady!");
          }
        }
      } catch (error) {
        setAdviceDetailsError("Nie udało się wyświetlić porady!");
      }
    }

    async function fetchUserRatedAdvice() {
      setUserVotedError();
      const url =
        import.meta.env.VITE_BACKEND_URL +
        "advices/" +
        adviceId +
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
    async function fetchAdviceDetails() {
      setAdviceDetailsloading(true);
      await fetchAdvice();
      await fetchUserRatedAdvice();
      setAdviceDetailsloading(false);
    }
    fetchAdviceDetails();
  }, [adviceId]);

  function handleRateAdvice() {
    setAdviceDetailsError();
    setRateAdviceLoading(true);
    async function sendRequest() {
      const url =
        import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId + "/rate";
      try {
        const response = await fetch(url, {
          method: "POST",
          body: getUserEmail(),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const advice = await response.json();
          setAdviceDetails(advice);
          setRateAdviceSuccess("Oceniono poradę.");
          setUserVoted(true);
        } else {
          setRateAdviceError("Nie udało się ocenić porady!");
        }
      } catch (error) {
        setRateAdviceError("Nie udało się ocenić porady!");
      }
      setRateAdviceLoading(false);
    }
    sendRequest();
  }

  return (
    <ContainerSection data-testid="advice-details-section">
      {adviceDetailsloading && <p>Ładowanie...</p>}
      {!adviceDetailsloading && adviceDetails && (
        <>
          <h1>{adviceDetails.name}</h1>
          <h2 className="py-6 cursor-default">
            Kategoria:
            <p className="text-sky-500 text-lg ">
              {adviceDetails.categoryDisplayName}
            </p>
          </h2>

          <p className="border border-sky-500 rounded py-6 px-6">
            {adviceDetails.content}
          </p>
          <div className="py-6">
            <p>Ocena przydatności:</p>
            <p className="text-sky-500 text-lg">{adviceDetails.rating}</p>
          </div>
          {token && (
            <Button
              disabled={rateAdviceLoading || rateAdviceSuccess || userVoted}
              onClick={handleRateAdvice}
            >
              {rateAdviceLoading
                ? "Wysyłanie oceny..."
                : userVoted
                ? "Oceniono"
                : "Oceń jako przydatne"}
            </Button>
          )}
          {!token && <p className="py-6">Zaloguj się aby zagłosować</p>}
        </>
      )}

      {rateAdviceSuccess && (
        <p className="py-6 text-green-500">{rateAdviceSuccess}</p>
      )}

      {adviceDetailsError && (
        <p className="py-6 text-red-500">{adviceDetailsError}</p>
      )}

      {rateAdviceError && (
        <p className="py-6 text-red-500">{rateAdviceError}</p>
      )}

      {userVotedError && <p className="py-6 text-red-500">{userVotedError}</p>}
    </ContainerSection>
  );
}
