import { Link } from "react-router-dom";

export default function rating() {
  const topAdvices = [
    {
      id: 1,
      name: "Porada 1",
      rating: 89234,
    },
    {
      id: 2,
      name: "Porada 2",
      rating: 1242,
    },
    {
      id: 3,
      name: "Porada 3",
      rating: 523,
    },
    {
      id: 4,
      name: "Porada 4",
      rating: 423,
    },
    {
      id: 5,
      name: "Porada 5",
      rating: 231,
    },
    {
      id: 6,
      name: "Porada 6",
      rating: 120,
    },
    {
      id: 7,
      name: "Porada 7",
      rating: 112,
    },
    {
      id: 8,
      name: "Porada 8",
      rating: 86,
    },
    {
      id: 9,
      name: "Porada 9",
      rating: 74,
    },
    {
      id: 10,
      name: "Porada 10",
      rating: 52,
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
              <td>{advice.rating}</td>
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
