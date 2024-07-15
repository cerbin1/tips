import { Link } from "react-router-dom";
import TableHeader from "../../common/TableHeader";

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

const tableHeaders = ["Kategoria", "Opis", "Liczba porad", "Szczegóły"];

export default function Categories() {
  return (
    <section className="container" data-testid="categories-section">
      <h1>Kategorie Porad</h1>
      <table className="mt-4">
        <TableHeader headers={tableHeaders} />
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="hover:bg-slate-200 even:bg-slate-100"
            >
              <td className="py-3 px-6 border border-slate-400">
                {category.name}
              </td>
              <td className="py-3 px-6 border border-slate-400">
                {category.description}
              </td>
              <td className="py-3 px-6 border border-slate-400">
                {category.advicesCount}
              </td>
              <td className="py-3 px-6 border border-slate-400">
                <Link
                  className="text-blue-to-dark text-lg"
                  to={"/categories/" + category.id}
                >
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
