import { useEffect, useState } from "react";
import ContainerSection from "../common/ContainerSection";
import { useParams } from "react-router";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import RequestError from "../common/RequestError";
import Loader from "../common/Loader";
import { activateUserUrl } from "../../util/endpoints";

export default function ActivateUser() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const params = useParams();
  const { token } = useParams();

  useEffect(() => {
    async function sendRequest() {
      try {
        const response = await fetch(activateUserUrl(token));

        if (response.ok) {
          setLoading(false);
        } else {
          throw new Error();
        }
      } catch (error) {
        setError("Nie udało się aktywować użytkownika!");
      }
      setLoading(false);
    }

    sendRequest();
  }, [params.token]);

  return (
    <ContainerSection data-testid="activate-user-section">
      {loading && <Loader />}
      {!loading && !error && (
        <>
          <p className="py-6 text-green-600">Konto zostało aktywowane.</p>
          <Button>
            <Link to="/login">Przejdź do logowania</Link>
          </Button>
        </>
      )}

      <RequestError content={error} />
    </ContainerSection>
  );
}
