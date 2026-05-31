import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

export default function Flashcards({ cards }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState(0);
  const c = cards[i];

  const advance = (gotIt) => {
    if (gotIt) setKnown((k) => k + 1);
    setFlip(false);
    setTimeout(() => setI((p) => (p + 1) % cards.length), 180);
  };

  return (
    <div>
      <div className="fcstage">
        <div className={"fc" + (flip ? " flip" : "")} onClick={() => setFlip((f) => !f)}>
          <div className="fcface fcfront">
            <div className="fclabel">Card {i + 1}</div>
            <div className="fcterm">{c.front}</div>
            <div className="fchint">tap to reveal</div>
          </div>
          <div className="fcface fcback">
            <div className="fclabel">Answer</div>
            <div className="fcbody">{c.back}</div>
          </div>
        </div>
      </div>
      <div className="fcctrl">
        <button className="btn again" onClick={() => advance(false)}>
          <RotateCcw size={15} /> Review again
        </button>
        <button className="btn know" onClick={() => advance(true)}>
          <Check size={15} /> I know this
        </button>
      </div>
      <div className="fcpos">
        {i + 1} / {cards.length} · {known} marked known this round
      </div>
    </div>
  );
}
