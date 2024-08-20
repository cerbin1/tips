import { useEffect, useState } from "react";
import { getUserEmail, getUserRoles } from "../../util/auth";
import ContainerSection from "../common/ContainerSection";
import Table from "../common/table/Table";
import { Link } from "react-router-dom";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";

export default function Profile() {
  const [votedAdvices, setVotedAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchUserVotedAdvices() {
      setLoading(true);
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
        setError("Nie udało się pobrać ocenionych porad!");
      }
      setLoading(false);
    }
    fetchUserVotedAdvices();
  }, []);

  const tableHeaders = ["Nazwa", "Kategoria", "Szczegóły"];
  const rows = votedAdvices.map((advice) => (
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

  return (
    <ContainerSection data-testid="profile-section">
      <h1>Profil</h1>
      <p>Użytkownik jest zalogowany</p>
      <p>Adres email użytkownika: {getUserEmail()}</p>
      <p>Role użytkownika: {getUserRoles()} </p>
      {!error && !loading && votedAdvices && votedAdvices.length === 0 && (
        <p>Brak ocenionych porad</p>
      )}
      {!error && votedAdvices && votedAdvices.length > 0 && (
        <>
          <h2>Ocenione porady:</h2>
          <Table
            head={<TableHeader headers={tableHeaders} />}
            body={<TableBody rows={rows} />}
          />
        </>
      )}

      {loading && <div className="py-6">Ładowanie...</div>}
      {error && <div className="py-6 text-red-500">{error}</div>}
    </ContainerSection>
  );
}
