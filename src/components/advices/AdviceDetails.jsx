import { useState } from "react";
import ContainerSection from "../common/ContainerSection";
import Button from "../common/Button";

export default function AdviceDetails() {
  const [rating, setRating] = useState(5);

  function increaseRating() {
    setRating((previousRating) => previousRating + 1);
  }

  return (
    <ContainerSection data-testid="advice-details-section">
      <h1>Nazwa porady</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p>Ocena przydatności: {rating}</p>
      <Button onClick={increaseRating}>Oceń jako przydatne</Button>
    </ContainerSection>
  );
}
