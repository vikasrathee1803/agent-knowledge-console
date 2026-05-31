import { useState } from "react";
import { RotateCcw, ArrowRight, Trophy } from "lucide-react";

export default function Quiz({ quiz, best, onFinish }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quiz[i];

  const pick = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 < quiz.length) {
      setI(i + 1);
      setPicked(null);
    } else {
      setDone(true);
      onFinish(score, quiz.length);
    }
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    const msg =
      pct === 100 ? "Flawless. Mark this module mastered."
      : pct >= 75 ? "Strong. Review any miss and you are set."
      : pct >= 50 ? "Decent footing. Re-read the lessons, then retake."
      : "Worth another pass through the lessons before retrying.";
    return (
      <div className="res">
        <div className="resicon"><Trophy size={26} /></div>
        <div className="resscore">
          {score}<span className="of"> / {quiz.length}</span>
        </div>
        <div className="reslbl">
          {pct}% correct{best != null ? ` · best ${best}/${quiz.length}` : ""}
        </div>
        <div className="resmsg">{msg}</div>
        <div className="resbtns">
          <button className="btn" onClick={restart}>
            <RotateCcw size={15} /> Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="qnum">Question {i + 1} of {quiz.length}</div>
      <h3 className="qtext">{q.q}</h3>
      {q.options.map((opt, idx) => {
        let cls = "opt";
        if (picked !== null) {
          if (idx === q.answer) cls += " correct";
          else if (idx === picked) cls += " wrong";
        }
        return (
          <button key={idx} className={cls} disabled={picked !== null} onClick={() => pick(idx)}>
            <span className="key">{String.fromCharCode(65 + idx)}</span>
            <span>{opt}</span>
          </button>
        );
      })}
      {picked !== null && (
        <>
          <div className="why">
            <div className="t">{picked === q.answer ? "Correct" : "Why"}</div>
            <div className="b">{q.why}</div>
          </div>
          <button className="next" onClick={next}>
            {i + 1 < quiz.length ? "Next question" : "See results"} <ArrowRight size={15} />
          </button>
        </>
      )}
    </div>
  );
}
