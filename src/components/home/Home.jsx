import { useState } from "react";

export default function Home() {
  const [advice, setAdvice] = useState();

  function setRandomAdvice() {
    setAdvice("Porada");
  }

  return (
    <section>
      <h1>HERO</h1>
      {!advice && <h3>Żyj lepiej z tymi poradami</h3>}
      <div className="home-container">
        <div>
          {advice && <p>{advice}</p>}
          <button onClick={setRandomAdvice}>Losuj poradę</button>
          {advice && <button>Szczegóły</button>}
        </div>
        <div>
          <h2>Najpopularniejsze</h2>
          <ul>
            <li>Porada 1</li>
            <li>Porada 2</li>
            <li>Porada 3</li>
            <li>Porada 4</li>
            <li>Porada 5</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
