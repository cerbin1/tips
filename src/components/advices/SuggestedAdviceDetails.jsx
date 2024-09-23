import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../store/auth-context";
import { getUserEmail } from "../../util/auth";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import Loader from "../common/Loader";
import RequestError from "../common/RequestError";
import SecondaryButton from "../common/SecondaryButton";
import {
  getSuggestedAdviceDetailsUrl,
  getUserVotedSuggestedAdviceInfoUrl,
  voteSuggestedAdviceUrl,
} from "../../util/endpoints";

export default function SuggestedAdviceDetails() {
  const [suggestedAdviceDetails, setSuggestedAdviceDetails] = useState();
  const [suggestedAdviceDetailsLoading, setSuggestedAdviceDetailsLoading] =
    useState(false);
  const [suggestedAdviceDetailsError, setSuggestedAdviceDetailsError] =
    useState();
  const [userVoted, setUserVoted] = useState();
  const [userVotedError, setUserVotedError] = useState();
  const [voteAdviceError, setVoteAdviceError] = useState();
  const [voteAdviceUpLoading, setVoteAdviceUpLoading] = useState(false);
  const [voteAdviceUp, setVoteAdviceUp] = useState(false);
  const [voteAdviceSuccess, setVoteAdviceSuccess] = useState();
  const [voteAdviceDownLoading, setVoteAdviceDownLoading] = useState(false);
  const [voteAdviceDown, setVoteAdviceDown] = useState(false);
  const { token } = useAuth();
  const { id } = useParams();

  async function handleVoteAdviceUp() {
    setVoteAdviceError();
    setVoteAdviceUpLoading(true);
    const response = await sendVoteAdviceRequest(true);
    if (response.ok) {
      setVoteAdviceUp(true);
      const advice = await response.json();
      setSuggestedAdviceDetails(advice);
      setVoteAdviceSuccess("Ocena podwyższona pomyślnie.");
    } else {
      setVoteAdviceError("Nie udało się ocenić porady!");
    }
    setVoteAdviceUpLoading(false);
  }

  async function handleVoteAdviceDown() {
    setVoteAdviceError();
    setVoteAdviceDownLoading(true);
    const response = await sendVoteAdviceRequest(false);
    if (response.ok) {
      setVoteAdviceDown(true);
      const advice = await response.json();
      setSuggestedAdviceDetails(advice);
      setVoteAdviceSuccess("Ocena obniżona pomyślnie.");
    } else {
      setVoteAdviceError("Nie udało się ocenić porady!");
    }
    setVoteAdviceDownLoading(false);
  }

  async function sendVoteAdviceRequest(voteType) {
    try {
      const response = await fetch(voteSuggestedAdviceUrl(id, voteType), {
        method: "POST",
        body: getUserEmail(),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response;
    } catch (error) {
      setVoteAdviceError("Nie udało się ocenić porady!");
    }
  }

  useEffect(() => {
    async function fetchSuggestedAdviceDetails() {
      setSuggestedAdviceDetailsError();
      try {
        const response = await fetch(getSuggestedAdviceDetailsUrl(id));
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

    async function fetchUserVotedAdvice() {
      setUserVotedError();
      const response = await fetch(
        getUserVotedSuggestedAdviceInfoUrl(id, getUserEmail()),
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
      setSuggestedAdviceDetailsLoading(true);
      await fetchSuggestedAdviceDetails();
      await fetchUserVotedAdvice();
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
                  voteAdviceDownLoading || voteAdviceDown || voteAdviceSuccess
                }
                onClick={handleVoteAdviceDown}
              >
                {voteAdviceDownLoading
                  ? "Wysyłanie oceny..."
                  : voteAdviceDown
                  ? "Oceniono"
                  : "Oceń jako nieprzydatne"}
              </SecondaryButton>
              <Button
                onClick={handleVoteAdviceUp}
                disabled={
                  voteAdviceUpLoading || voteAdviceUp || voteAdviceSuccess
                }
              >
                {voteAdviceUpLoading
                  ? "Wysyłanie oceny..."
                  : voteAdviceUp
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
      <RequestError content={voteAdviceError} />
      {voteAdviceSuccess && (
        <p className="py-6 text-green-500">{voteAdviceSuccess}</p>
      )}
    </ContainerSection>
  );
}
