import ContainerSection from "./common/ContainerSection";
import SuggestAdvice from "./advices/SuggestAdvice";
import { useState } from "react";
import LinkButton from "./common/LinkButton";
import SuggestCategory from "./advices/categories/SuggestCategory";

export default function Suggestions() {
  const [suggestAdvice, setSuggestAdvice] = useState(true);
  function handleTypeChange() {
    setSuggestAdvice((previousType) => !previousType);
  }
  return (
    <ContainerSection data-testid="suggestions-section">
      <LinkButton onClick={handleTypeChange}>
        {suggestAdvice
          ? "Przejdź do propozycji kategorii"
          : "Przejdź do propozycji porady"}
      </LinkButton>
      {suggestAdvice ? <SuggestAdvice /> : <SuggestCategory />}
    </ContainerSection>
  );
}
