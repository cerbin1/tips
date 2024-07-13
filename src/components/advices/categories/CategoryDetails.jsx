import { Link } from "react-router-dom";

const advices = [
  {
    id: 1,
    name: "Porada 1",
    rating: 1542,
  },
  {
    id: 2,
    name: "Porada 2",
    rating: 523,
  },
  {
    id: 3,
    name: "Porada 3",
    rating: 152,
  },
  {
    id: 4,
    name: "Porada 4",
    rating: 23,
  },
  {
    id: 5,
    name: "Porada 5",
    rating: 12,
  },
];

export default function CategoryDetails() {
  return (
    <>
      <h1>Nazwa kategorii</h1>
      <table>
        <thead>
          <tr>
            <th>Porada</th>
            <th>Ocena</th>
            <th>Szczegóły</th>
          </tr>
        </thead>
        <tbody>
          {advices.map((advice) => (
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
