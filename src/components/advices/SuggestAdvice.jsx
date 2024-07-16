import ContainerSection from "../common/ContainerSection";
import Button from "../common/Button";

const categories = [
  { id: 0, name: "Wybierz kategorię" },
  { id: 1, name: "Rozwój osobisty" },
  { id: 2, name: "Dom" },
  { id: 3, name: "Praca" },
  { id: 4, name: "Zwierzęta" },
];

export default function SuggestAdvice() {
  return (
    <ContainerSection data-testid="suggest-advice-section">
      <h1>Zaproponuj poradę</h1>
      <form
        aria-label="SuggestAdvice"
        className="flex flex-col gap-4 text-lg w-1/3"
      >
        <div className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
          <label htmlFor="name">Nazwa porady</label>
          <input
            id="name"
            name="name"
            type="text"
            className="bg-slate-200 rounded py-2 px-1"
          />
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
          <label htmlFor="category">Kategoria</label>
          <select
            name="category"
            id="category"
            className="bg-slate-200 rounded py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
          <label htmlFor="content">Treść</label>
          <textarea
            name="content"
            id="content"
            className="bg-slate-200 rounded py-2 px-1"
          ></textarea>
        </div>
        <Button>Wyślij propozycję</Button>
      </form>
    </ContainerSection>
  );
}
