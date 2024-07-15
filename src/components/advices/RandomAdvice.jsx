import { useState } from "react";
import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";

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
    <ContainerSection data-testid="random-advice-section">
      <h1 className="text-center py-4">{randomAdvice}</h1>
      <Button
        onClick={() =>
          setRandomAdvice(advices[Math.floor(Math.random() * advices.length)])
        }
      >
        Wylosuj nową poradę
      </Button>
    </ContainerSection>
  );
}
