import { useEffect, useState } from "react";
import ContainerSection from "../common/ContainerSection";
import Button from "../common/Button";
import { useParams } from "react-router";
import { getUserEmail } from "../../util/auth";
import { useAuth } from "../../store/auth-context";

export default function AdviceDetails() {
  const [adviceDetailsloading, setAdviceDetailsloading] = useState(false);
  const [advice, setAdvice] = useState();
  const [adviceFetchError, setAdviceFetchError] = useState();
  const [rateAdviceLoading, setRateAdviceLoading] = useState(false);
  const [rateAdviceError, setRateAdviceError] = useState();
  const [rateAdviceSuccess, setRateAdviceSuccess] = useState();
  const [userVoted, setUserVoted] = useState(false);
  const { adviceId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchAdvice() {
      setAdviceFetchError(null);
      const url = import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const advice = await response.json();
          setAdvice(advice);
        } else {
          if (response.status === 404) {
            setAdviceFetchError("Nie znaleziono porady!");
          } else {
            setAdviceFetchError("Nie udało się wyświetlić porady!");
          }
        }
      } catch (error) {
        setAdviceFetchError("Nie udało się wyświetlić porady!");
      }
    }

    async function fetchUserRatedAdvice() {
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
    setAdviceFetchError(null);
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
          setAdvice(advice);
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
      {!adviceDetailsloading && advice && (
        <>
          <h1>{advice.name}</h1>
          <h2 className="py-6 cursor-default">
            Kategoria:
            <p className="text-sky-500 text-lg ">
              {advice.categoryDisplayName}
            </p>
          </h2>

          <p className="border border-sky-500 rounded py-6 px-6">
            {advice.content}
          </p>
          <div className="py-6">
            <p>Ocena przydatności:</p>
            <p className="text-sky-500 text-lg">{advice.rating}</p>
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

      {adviceFetchError && (
        <p className="py-6 text-red-500">{adviceFetchError}</p>
      )}

      {rateAdviceError && (
        <p className="py-6 text-red-500">{rateAdviceError}</p>
      )}
    </ContainerSection>
  );
}
