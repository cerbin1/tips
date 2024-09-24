import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../store/auth-context";
import { getUserEmail } from "../../util/auth";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import RequestError from "../common/RequestError";
import Loader from "../common/Loader";
import {
  getAdviceDetailsUrl,
  getUserVotedAdviceInfoUrl,
  voteAdviceUrl,
} from "../../util/endpoints";

export default function AdviceDetails() {
  const [adviceDetails, setAdviceDetails] = useState();
  const [adviceDetailsloading, setAdviceDetailsloading] = useState(false);
  const [adviceDetailsError, setAdviceDetailsError] = useState();
  const [voteAdviceLoading, setVoteAdviceLoading] = useState(false);
  const [voteAdviceError, setVoteAdviceError] = useState();
  const [voteAdviceSuccess, setVoteAdviceSuccess] = useState();
  const [userVoted, setUserVoted] = useState(false);
  const [userVotedError, setUserVotedError] = useState();
  const [showSource, setShowSource] = useState(false);
  const { adviceId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchAdvice() {
      setAdviceDetailsError();

      try {
        const response = await fetch(getAdviceDetailsUrl(adviceId));
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

    async function fetchUserVotedAdvice() {
      setUserVotedError();
      const response = await fetch(
        getUserVotedAdviceInfoUrl(adviceId, getUserEmail()),
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
    async function fetchAdviceDetails() {
      setAdviceDetailsloading(true);
      await fetchAdvice();
      await fetchUserVotedAdvice();
      setAdviceDetailsloading(false);
    }
    fetchAdviceDetails();
  }, [adviceId]);

  function handleVoteAdvice() {
    setVoteAdviceError();
    setVoteAdviceLoading(true);
    async function sendRequest() {
      try {
        const response = await fetch(voteAdviceUrl(adviceId), {
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
          setVoteAdviceSuccess("Oceniono poradę.");
          setUserVoted(true);
        } else {
          setVoteAdviceError("Nie udało się ocenić porady!");
        }
      } catch (error) {
        setVoteAdviceError("Nie udało się ocenić porady!");
      }
      setVoteAdviceLoading(false);
    }
    sendRequest();
  }

  return (
    <ContainerSection data-testid="advice-details-section">
      {adviceDetailsloading && <Loader />}
      {!adviceDetailsloading && adviceDetails && (
        <>
          <h1>{adviceDetails.name}</h1>
          <h2 className="py-6 cursor-default">
            Kategoria:
            <p className="text-sky-500 text-lg ">
              {adviceDetails.categoryDisplayName}
            </p>
          </h2>
          {adviceDetails.source && (
            <div className="py-6">
              <h3>Źródło:</h3>

              <p
                className="text-sky-500 cursor-pointer"
                onClick={() => setShowSource(true)}
              >
                Pokaż źródło
              </p>
              {showSource && adviceDetails.source}
            </div>
          )}

          <p className="border border-sky-500 rounded py-6 px-6">
            {adviceDetails.content}
          </p>
          <div className="py-6">
            <p>Ocena przydatności:</p>
            <p className="text-sky-500 text-lg">{adviceDetails.rating}</p>
          </div>
          {token && (
            <Button
              disabled={voteAdviceLoading || voteAdviceSuccess || userVoted}
              onClick={handleVoteAdvice}
            >
              {voteAdviceLoading
                ? "Wysyłanie oceny..."
                : userVoted
                ? "Oceniono"
                : "Oceń jako przydatne"}
            </Button>
          )}
          {!token && <p className="py-6">Zaloguj się aby zagłosować</p>}
        </>
      )}

      {voteAdviceSuccess && (
        <p className="py-6 text-green-500">{voteAdviceSuccess}</p>
      )}

      <RequestError content={adviceDetailsError} />
      <RequestError content={voteAdviceError} />
      <RequestError content={userVotedError} />
    </ContainerSection>
  );
}
