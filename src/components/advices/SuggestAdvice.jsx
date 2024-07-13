export default function SuggestAdvice() {
  return (
    <>
      <h1>Zaproponuj poradę</h1>
      <form aria-label="SuggestAdvice">
        <label htmlFor="name">Nazwa porady</label>
        <input id="name" name="name" type="text" />

        <label htmlFor="name">Kategoria</label>
        <select name="category" id="category">
          <option value="">Wybierz kategorie</option>
          <option value="1">Rozwój osobisty</option>
          <option value="2">Dom</option>
          <option value="3">Praca</option>
          <option value="4">Zwierźta</option>
        </select>

        <label htmlFor="content">Treść</label>
        <textarea name="content" id="content"></textarea>
        <button>Wyślij propozycję</button>
      </form>
    </>
  );
}
