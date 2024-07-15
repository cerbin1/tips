import { useState } from "react";
import Button from "../common/Button";

const advices = [
  "Pij dużo wody każdego dnia.",
  "Regularnie uprawiaj sport.",
  "Czytaj książki każdego dnia.",
  "Spędzaj czas z rodziną i przyjaciółmi.",
  "Ucz się nowych rzeczy.",
  "Zadbaj o odpowiednią ilość snu.",
  "Unikaj stresu i znajdź czas na relaks.",
  "Jedz zdrowo i zbilansowane posiłki.",
];

export default function RandomAdvice() {
  const [randomAdvice, setRandomAdvice] = useState(advices[0]);

  return (
    <section data-testid="random-advice-section" className="container">
      <h1 className="advice">{randomAdvice}</h1>
      <Button
        onClick={() =>
          setRandomAdvice(advices[Math.floor(Math.random() * advices.length)])
        }
      >
        Wylosuj nową poradę
      </Button>
    </section>
  );
}
