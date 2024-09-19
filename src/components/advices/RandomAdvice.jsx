import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import RequestError from "../common/RequestError";
import Loader from "../common/Loader";
import { getRandomAdviceUrl } from "../../util/endpoints";

export default function RandomAdvice() {
  const [randomAdvice, setRandomAdvice] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  async function fetchRandomAdvice() {
    setLoading(true);
    setError();
    try {
      const response = await fetch(getRandomAdviceUrl());
      if (response.ok) {
        const advice = await response.json();
        setRandomAdvice(advice);
      } else {
        setError("Nie udało się wyświetlić porady!");
      }
    } catch (error) {
      setError("Nie udało się wyświetlić porady!");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRandomAdvice();
  }, []);

  return (
    <ContainerSection data-testid="random-advice-section">
      {loading && <Loader />}
      {!loading && !error && randomAdvice && (
        <div className="flex flex-col items-center py-6 gap-4">
          <h1>{randomAdvice.name}</h1>
          <p className="border border-sky-500 rounded py-6 px-6">
            {randomAdvice.content}
          </p>
          <Link
            className="text-blue-to-dark text-lg"
            to={"/advices/" + randomAdvice.id}
          >
            Wyświetl szczegóły
          </Link>
          <Button onClick={fetchRandomAdvice}>Wylosuj nową poradę</Button>
        </div>
      )}
      {!loading && error && (
        <>
          <RequestError content={error} />
          <Button onClick={fetchRandomAdvice}>Spróbuj ponownie</Button>
        </>
      )}
    </ContainerSection>
  );
}
