import { useEffect, useState } from "react";
import { getUserEmail, getUserRoles } from "../../util/auth";
import ContainerSection from "../common/ContainerSection";
import Table from "../common/table/Table";
import { Link } from "react-router-dom";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";
import { useAuth } from "../../store/auth-context";

export default function Profile() {
  const [votedAdvices, setVotedAdvices] = useState([]);
  const [votedAdvicesLoading, setVotedAdvicesLoading] = useState(false);
  const [votedAdvicesError, setVotedAdvicesError] = useState();
  const [suggestedAdvices, setSuggestedAdvices] = useState([]);
  const [suggestedAdvicesLoading, setSuggestedAdvicesLoading] = useState(false);
  const [suggestedAdvicesError, setSuggestedAdvicesError] = useState();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchUserVotedAdvices() {
      setVotedAdvicesLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            "advices?userEmail=" +
            getUserEmail()
        );
        if (response.ok) {
          const responseData = await response.json();
          setVotedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setVotedAdvicesError("Nie udało się pobrać ocenionych porad!");
      }
      setVotedAdvicesLoading(false);
    }
    fetchUserVotedAdvices();
  }, []);

  useEffect(() => {
    async function fetchUserSuggestedAdvices() {
      setSuggestedAdvicesLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "advices/suggested",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setSuggestedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setSuggestedAdvicesError("Nie udało się pobrać proponowanych porad!");
      }
      setSuggestedAdvicesLoading(false);
    }
    fetchUserSuggestedAdvices();
  }, []);

  const votedAdvicesTableHeaders = ["Nazwa", "Kategoria", "Szczegóły"];
  const votedAdvicesTableRows = votedAdvices.map((advice) => (
    <tr key={advice.name} className="hover:bg-slate-200 even:bg-slate-100">
      <td className="py-3 px-6 border border-slate-400">{advice.name}</td>
      <td className="py-3 px-6 border border-slate-400">
        {advice.categoryDisplayName}
      </td>
      <td className="py-3 px-6 border border-slate-400">
        <Link
          className="text-blue-to-dark text-lg"
          to={"/advices/" + advice.id}
        >
          Wyświetl szczegóły
        </Link>
      </td>
    </tr>
  ));

  const suggestedAdvicesTableHeaders = ["Nazwa", "Kategoria"];
  const suggestedAdvicesTableRows = suggestedAdvices.map((advice) => (
    <tr key={advice.id} className="hover:bg-slate-200 even:bg-slate-100">
      <td className="py-3 px-6 border border-slate-400">{advice.name}</td>
      <td className="py-3 px-6 border border-slate-400">
        {advice.category.displayName}
      </td>
    </tr>
  ));

  return (
    <ContainerSection data-testid="profile-section">
      <h1>Profil</h1>
      <p>Użytkownik jest zalogowany</p>
      <p>Adres email użytkownika: {getUserEmail()}</p>
      <p>Role użytkownika: {getUserRoles()} </p>
      {!votedAdvicesError &&
        !votedAdvicesLoading &&
        votedAdvices &&
        votedAdvices.length === 0 && <p>Brak ocenionych porad</p>}
      {!votedAdvicesError && votedAdvices && votedAdvices.length > 0 && (
        <>
          <h2>Ocenione porady:</h2>
          <Table
            head={<TableHeader headers={votedAdvicesTableHeaders} />}
            body={<TableBody rows={votedAdvicesTableRows} />}
          />
        </>
      )}
      {votedAdvicesLoading && (
        <div className="py-6">Ładowanie ocenionych porad...</div>
      )}
      {votedAdvicesError && (
        <div className="py-6 text-red-500">{votedAdvicesError}</div>
      )}

      {!suggestedAdvicesError &&
        !suggestedAdvicesLoading &&
        suggestedAdvices &&
        suggestedAdvices.length === 0 && <p>Brak proponowanych porad</p>}
      {!suggestedAdvicesError &&
        suggestedAdvices &&
        suggestedAdvices.length > 0 && (
          <>
            <h2>Proponowane porady:</h2>
            <Table
              head={<TableHeader headers={suggestedAdvicesTableHeaders} />}
              body={<TableBody rows={suggestedAdvicesTableRows} />}
            />
          </>
        )}

      {suggestedAdvicesLoading && (
        <div className="py-6">Ładowanie proponowanych porad...</div>
      )}
      {suggestedAdvicesError && (
        <div className="py-6 text-red-500">{suggestedAdvicesError}</div>
      )}
    </ContainerSection>
  );
}
