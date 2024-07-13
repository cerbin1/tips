import { Link } from "react-router-dom";

export default function Ranking() {
  const topAdvices = [
    {
      id: 1,
      name: "Porada 1",
      ranking: 89234,
    },
    {
      id: 2,
      name: "Porada 2",
      ranking: 1242,
    },
    {
      id: 3,
      name: "Porada 3",
      ranking: 523,
    },
    {
      id: 4,
      name: "Porada 4",
      ranking: 423,
    },
    {
      id: 5,
      name: "Porada 5",
      ranking: 231,
    },
    {
      id: 6,
      name: "Porada 6",
      ranking: 120,
    },
    {
      id: 7,
      name: "Porada 7",
      ranking: 112,
    },
    {
      id: 8,
      name: "Porada 8",
      ranking: 86,
    },
    {
      id: 9,
      name: "Porada 9",
      ranking: 74,
    },
    {
      id: 10,
      name: "Porada 10",
      ranking: 52,
    },
  ];

  return (
    <>
      <h2>Top 10 porad</h2>
      <table>
        <thead>
          <tr>
            <th>Porada</th>
            <th>Ocena</th>
            <th>Szczegóły</th>
          </tr>
        </thead>
        <tbody>
          {topAdvices.map((advice) => (
            <tr key={advice.id}>
              <td>{advice.name}</td>
              <td>{advice.ranking}</td>
              <td>
                <Link to="/advices">Wyświetl szczegóły</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
