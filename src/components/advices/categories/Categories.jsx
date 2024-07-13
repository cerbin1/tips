import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    advicesCount: 15,
    name: "Rozwój osobisty",
  },
  {
    id: 2,
    advicesCount: 102,
    name: "Dom",
  },
  {
    id: 3,
    advicesCount: 52,
    name: "Praca",
  },
  {
    id: 4,
    advicesCount: 0,
    name: "Zwierzęta",
  },
];

export default function Categories() {
  return (
    <div>
      <h2>Kategorie</h2>
      <table>
        <thead>
          <tr>
            <th>Kategoria</th>
            <th>Liczba porad</th>
            <th>Szczegóły</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.advicesCount}</td>
              <td>
                <Link to={"/categories/" + category.id}>
                  Wyświetl szczegóły
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
