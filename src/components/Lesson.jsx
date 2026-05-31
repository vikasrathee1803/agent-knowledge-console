import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// --- inline markup: **bold** and `code` -> React nodes ----------------------
function inline(text) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const NOTE_LABEL = { pitfall: "Pitfall", pro: "In production", tip: "Tip" };

function Section({ s }) {
  if (s.h) return <h4>{s.h}</h4>;
  if (s.p) return <p>{inline(s.p)}</p>;
  if (s.code)
    return (
      <pre>
        {s.lang && <span className="codelang">{s.lang}</span>}
        <code>{s.code}</code>
      </pre>
    );
  if (s.steps)
    return (
      <ul>
        {s.steps.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </ul>
    );
  if (s.note)
    return (
      <div className={"note " + (s.kind || "tip")}>
        <span className="nlabel">{NOTE_LABEL[s.kind] || "Note"}</span>
        {inline(s.note)}
      </div>
    );
  return null;
}

export default function Lesson({ lesson, done, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"lesson" + (done ? " done" : "") + (open ? " open" : "")}>
      <div className="lhead" onClick={() => setOpen((o) => !o)}>
        <button
          className={"lcheck" + (done ? " on" : "")}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label="mark lesson complete"
        >
          <Check size={15} />
        </button>
        <div className="lmeta">
          <h3 className="ltitle">
            {lesson.title}
            {lesson.daily && <span className="dailyflag">daily driver</span>}
          </h3>
          <div className="ltldr">
            <b>tl;dr</b>
            {lesson.tldr}
          </div>
        </div>
        <ChevronDown className="lchev" size={18} />
      </div>
      {open && (
        <div className="lbody">
          {lesson.body.map((s, i) => (
            <Section key={i} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
