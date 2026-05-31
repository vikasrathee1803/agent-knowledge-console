import { useState } from "react";
import { Check, X, Eye, Quote } from "lucide-react";
import { Flow, Compare } from "./Diagrams.jsx";

// Interview drills. Two item shapes:
//   { type: "mcq",  q, options: [...], answer: idx, why }
//   { type: "open", q, headline, points: [...], say, diagram?: { flow | compare } }

const KEY = ["A", "B", "C", "D", "E"];

function Illustration({ d }) {
  if (!d) return null;
  if (d.flow) return <Flow data={d.flow} />;
  if (d.compare) return <Compare data={d.compare} />;
  return null;
}

function McqCard({ item, n }) {
  const [picked, setPicked] = useState(null);
  const done = picked !== null;
  return (
    <div className="iv-card">
      <div className="iv-tag">Q{n} · recall</div>
      <div className="iv-q">{item.q}</div>
      <div className="iv-opts">
        {item.options.map((opt, idx) => {
          const isAns = idx === item.answer;
          const cls = !done ? "" : isAns ? " correct" : idx === picked ? " wrong" : "";
          return (
            <button key={idx} className={"opt" + cls} disabled={done} onClick={() => setPicked(idx)}>
              <span className="key">
                {done && isAns ? <Check size={13} /> : done && idx === picked ? <X size={13} /> : KEY[idx]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="why">
          <div className="t">why</div>
          <div className="b">{item.why}</div>
        </div>
      )}
    </div>
  );
}

function OpenCard({ item, n }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="iv-card">
      <div className="iv-tag">Q{n} · spoken answer</div>
      <div className="iv-q">{item.q}</div>
      {!open ? (
        <button className="iv-reveal" onClick={() => setOpen(true)}>
          <Eye size={15} /> Answer it in your head, then reveal
        </button>
      ) : (
        <div className="iv-ans">
          <div className="iv-headline">{item.headline}</div>
          <div className="iv-sub">Hit these points</div>
          <ul className="iv-points">
            {item.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          <Illustration d={item.diagram} />
          <div className="iv-say">
            <Quote size={13} />
            <span>{item.say}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Interview({ items }) {
  if (!items || !items.length)
    return <div className="iv-empty">No interview questions for this module yet.</div>;
  let qn = 0;
  return (
    <div className="iv">
      <p className="iv-intro">
        Mixed drills: multiple-choice for fast recall, plus open “spoken answer” questions with a
        model answer. Try to answer before revealing — the effort of recalling is what makes it stick.
      </p>
      {items.map((item, i) => {
        qn += 1;
        return item.type === "mcq" ? (
          <McqCard key={i} item={item} n={qn} />
        ) : (
          <OpenCard key={i} item={item} n={qn} />
        );
      })}
    </div>
  );
}
