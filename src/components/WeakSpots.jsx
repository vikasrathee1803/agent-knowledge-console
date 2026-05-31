import { useState } from "react";
import { ChevronLeft, ArrowRight, Trash2, Target, CheckCircle2 } from "lucide-react";
import { MODULES } from "../data/curriculum.js";
import { McqCard } from "./Interview.jsx";
import { loadWeak, clearWeak } from "../lib/storage.js";

// All MCQ items across every module, tagged with their module name.
function allMcqs() {
  const out = [];
  for (const m of MODULES)
    for (const it of m.interview || [])
      if (it.type === "mcq") out.push({ ...it, module: m.name });
  return out;
}

export default function WeakSpots({ onBack }) {
  // Snapshot the weak set on mount so the list is stable while you drill.
  const [pool] = useState(() => {
    const weak = loadWeak();
    return allMcqs().filter((it) => weak[it.q]);
  });
  const [i, setI] = useState(0);

  const empty = pool.length === 0;
  const atEnd = i >= pool.length - 1;
  const item = pool[i];

  return (
    <>
      <button className="back" onClick={onBack}>
        <ChevronLeft size={15} /> all modules
      </button>

      <div className="mhead">
        <div className="cicon" style={{ marginBottom: 0 }}>
          <Target size={20} />
        </div>
        <div>
          <h2 className="mh1">Weak Spots</h2>
          <p className="mblurb">
            The multiple-choice questions you've missed, pulled from every module. Answer one
            correctly and it clears itself from this list — drill until it's empty.
          </p>
        </div>
      </div>

      {empty ? (
        <div className="ws-done">
          <CheckCircle2 size={40} />
          <div className="ws-done-h">No weak spots right now</div>
          <p>
            Miss a multiple-choice question in any <b>Interview</b> tab or the <b>Mixed drill</b> and
            it shows up here so you can hammer it until it sticks.
          </p>
        </div>
      ) : (
        <>
          <div className="md-src">
            from <b>{item.module}</b> · {i + 1} / {pool.length} to review
          </div>
          <McqCard key={i} item={item} n={i + 1} />
          <button className="next" onClick={() => (atEnd ? onBack() : setI(i + 1))}>
            {atEnd ? (
              <>done — back to modules</>
            ) : (
              <>
                next weak spot <ArrowRight size={15} />
              </>
            )}
          </button>
          <button
            className="ws-clear"
            onClick={() => {
              clearWeak();
              onBack();
            }}
          >
            <Trash2 size={13} /> clear all weak spots
          </button>
        </>
      )}
    </>
  );
}
