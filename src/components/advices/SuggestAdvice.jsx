const categories = [
  { id: 0, name: "Wybierz kategorię" },
  { id: 1, name: "Rozwój osobisty" },
  { id: 2, name: "Dom" },
  { id: 3, name: "Praca" },
  { id: 4, name: "Zwierzęta" },
];

export default function SuggestAdvice() {
  return (
    <>
      <h1>Zaproponuj poradę</h1>
      <form aria-label="SuggestAdvice">
        <label htmlFor="name">Nazwa porady</label>
        <input id="name" name="name" type="text" />

        <label htmlFor="name">Kategoria</label>
        <select name="category" id="category">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="content">Treść</label>
        <textarea name="content" id="content"></textarea>
        <button>Wyślij propozycję</button>
      </form>
    </>
  );
}
