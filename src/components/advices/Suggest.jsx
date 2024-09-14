import { useState } from "react";
import SuggestCategory from "./categories/SuggestCategory";
import SuggestAdvice from "./SuggestAdvice";
import ContainerSection from "../common/ContainerSection";

export default function Suggest() {
  const [suggestAdvice, setSuggestAdvice] = useState(true);
  function handleTypeChange() {
    setSuggestAdvice((previousType) => !previousType);
  }
  return (
    <ContainerSection data-testid="suggest-section">
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
