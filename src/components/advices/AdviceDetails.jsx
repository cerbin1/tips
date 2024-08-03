import { useEffect, useState } from "react";
import ContainerSection from "../common/ContainerSection";
import Button from "../common/Button";
import { useParams } from "react-router";

export default function AdviceDetails() {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState();
  const [error, setError] = useState();
  const { adviceId } = useParams();

  useEffect(() => {
    async function fetchAdvice() {
      setError(null);
      setLoading(true);
      const url = import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const advice = await response.json();
          setAdvice(advice);
        } else {
          if (response.status === 404) {
            setError("Nie znaleziono porady!");
          } else {
            setError("Nie udało się wyświetlić porady!");
          }
        }
      } catch (error) {
        setError("Nie udało się wyświetlić porady!");
      }
      setLoading(false);
    }
    fetchAdvice();
  }, [adviceId]);

  return (
    <ContainerSection data-testid="advice-details-section">
      {loading && <p>Ładowanie...</p>}
      {!loading && advice && (
        <>
          <h1>{advice.name}</h1>
          <h2>Kategoria: {advice.category}</h2>
          <p>{advice.content}</p>
          <p>Ocena przydatności: {advice.rating}</p>
          <Button>Oceń jako przydatne</Button>
        </>
      )}

      {error && <p className="py-6 text-red-500">{error}</p>}
    </ContainerSection>
  );
}
