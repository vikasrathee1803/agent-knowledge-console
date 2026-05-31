import { useState } from "react";
import { Shuffle, ArrowRight, ChevronLeft } from "lucide-react";
import { MODULES } from "../data/curriculum.js";
import { McqCard, OpenCard, LEVEL_FILTERS } from "./Interview.jsx";

function buildPool(level) {
  const out = [];
  for (const m of MODULES)
    for (const it of m.interview || [])
      if (level === "all" || it.level === level) out.push({ ...it, module: m.name });
  return out;
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MixedDrill({ onBack }) {
  const [level, setLevel] = useState("all");
  const [order, setOrder] = useState(() => shuffled(buildPool("all")));
  const [i, setI] = useState(0);

  const setFilter = (lv) => {
    setLevel(lv);
    setOrder(shuffled(buildPool(lv)));
    setI(0);
  };
  const reshuffle = () => {
    setOrder(shuffled(buildPool(level)));
    setI(0);
  };

  const item = order[i];
  const atEnd = i >= order.length - 1;

  return (
    <>
      <button className="back" onClick={onBack}>
        <ChevronLeft size={15} /> all modules
      </button>

      <div className="mhead">
        <div className="cicon" style={{ marginBottom: 0 }}>
          <Shuffle size={20} />
        </div>
        <div>
          <h2 className="mh1">Mixed Interview Drill</h2>
          <p className="mblurb">
            Random questions pulled from every module. Answer in your head before revealing, then
            shuffle again — this is your dress rehearsal for the real thing.
          </p>
        </div>
      </div>

      <div className="iv-filter">
        {LEVEL_FILTERS.map(([k, label]) => (
          <button key={k} className={"iv-fbtn" + (level === k ? " on" : "")} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
        <button className="iv-fbtn shuf" onClick={reshuffle}>
          <Shuffle size={13} /> shuffle
        </button>
      </div>

      {order.length === 0 ? (
        <div className="iv-empty">No questions at this level.</div>
      ) : (
        <>
          <div className="md-src">
            from <b>{item.module}</b> · {i + 1} / {order.length}
          </div>
          {item.type === "mcq" ? (
            <McqCard key={i} item={item} n={i + 1} />
          ) : (
            <OpenCard key={i} item={item} n={i + 1} />
          )}
          <button className="next" onClick={() => (atEnd ? reshuffle() : setI(i + 1))}>
            {atEnd ? (
              <>
                shuffle &amp; restart <Shuffle size={15} />
              </>
            ) : (
              <>
                next question <ArrowRight size={15} />
              </>
            )}
          </button>
        </>
      )}
    </>
  );
}
