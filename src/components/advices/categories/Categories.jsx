import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    advicesCount: 15,
    name: "Rozwój osobisty",
    description: "Porady dotyczące samorozwoju i motywacji.",
  },
  {
    id: 2,
    advicesCount: 102,
    name: "Dom",
    description:
      "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.",
  },
  {
    id: 3,
    advicesCount: 52,
    name: "Zdrowie",
    description: "Porady dotyczące zdrowia i dobrego samopoczucia.",
  },
  {
    id: 4,
    advicesCount: 52,
    name: "Finanse",
    description: "Porady dotyczące zarządzania finansami.",
  },
  {
    id: 5,
    advicesCount: 0,
    name: "Technologia",
    description: "Porady dotyczące nowinek technologicznych.",
  },
];

export default function Categories() {
  return (
    <section className="container" data-testid="categories-section">
      <h1 className="categories-title">Kategorie Porad</h1>
      <table className="categories-table">
        <thead>
          <tr>
            <th>Kategoria</th>
            <th>Opis</th>
            <th>Liczba porad</th>
            <th>Szczegóły</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
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
    </section>
  );
}
