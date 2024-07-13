import { useState } from "react";

export default function Home() {
  const [tip, setTip] = useState();

  function setRandomTip() {
    setTip("Porada");
  }

  return (
    <section>
      <h1>HERO</h1>
      {!tip && <h3>Żyj lepiej z tymi poradami</h3>}
      <div className="home-container">
        <div>
          {tip && <p>{tip}</p>}
          <button onClick={setRandomTip}>Losuj poradę</button>
          {tip && <button>Szczegóły</button>}
        </div>
      </div>
    </section>
  );
}
