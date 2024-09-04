import { useState } from "react";
import SuggestCategory from "./advices/categories/SuggestCategory";
import SuggestAdvice from "./advices/SuggestAdvice";
import ContainerSection from "./common/ContainerSection";

export default function Suggestions() {
  const [suggestAdvice, setSuggestAdvice] = useState(true);
  function handleTypeChange() {
    setSuggestAdvice((previousType) => !previousType);
  }
  return (
    <ContainerSection data-testid="suggestions-section">
      <p
        className="text-blue-to-light cursor-pointer"
        onClick={handleTypeChange}
      >
        {suggestAdvice
          ? "Przejdź do propozycji kategorii"
          : "Przejdź do propozycji porady"}
      </p>

      {suggestAdvice ? <SuggestAdvice /> : <SuggestCategory />}
    </ContainerSection>
  );
}
