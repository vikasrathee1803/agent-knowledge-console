import { ArrowRight, Trophy, Shuffle } from "lucide-react";
import { ICONS } from "./icons.js";

export default function Home({ modules, totalLessons, progress, onOpen, onMixed }) {
  const doneCount = Object.values(progress.done).filter(Boolean).length;
  const overall = Math.round((doneCount / totalLessons) * 100);

  const moduleDone = (m) =>
    m.lessons.reduce((n, l) => n + (progress.done[l.id] ? 1 : 0), 0);

  return (
    <>
      <div className="hero">
        <div className="kicker">data / bi &nbsp;→&nbsp; agent engineer</div>
        <h1 className="h1">
          Build <em>AI agents</em>,<br />the way a pro actually does.
        </h1>
        <p className="sub">
          Six modules from Python to production, written for depth not fluff. Each lesson
          opens with a tl;dr so you can scan fast and dive only where you need to. Drill
          with flashcards, then prove it on the quiz. Progress saves on this device.
        </p>
      </div>

      <div className="progrow">
        <div className="n">{doneCount}/{totalLessons} lessons</div>
        <div className="barwrap"><div className="barfill" style={{ width: `${overall}%` }} /></div>
      </div>

      <button className="mixcta" onClick={onMixed}>
        <Shuffle size={16} />
        Mixed interview drill — random questions from every module
        <ArrowRight size={16} className="mixarrow" />
      </button>

      <div className="grid">
        {modules.map((m, idx) => {
          const Icon = ICONS[m.icon];
          const dn = moduleDone(m);
          const pct = Math.round((dn / m.lessons.length) * 100);
          const qb = progress.quiz[m.id];
          return (
            <button key={m.id} className="card" onClick={() => onOpen(m.id)}>
              <div className="ctag">{String(idx + 1).padStart(2, "0")} · {m.tag}</div>
              <div className="cicon">{Icon && <Icon size={19} />}</div>
              <h3 className="cname">{m.name}</h3>
              <p className="cblurb">{m.blurb}</p>
              <div className="cprog"><div className="cprogfill" style={{ width: `${pct}%` }} /></div>
              <div className="cfoot">
                <span className="cstat">
                  <b>{dn}</b>/{m.lessons.length} lessons
                  {qb && (
                    <span className="badge"><Trophy size={11} /> {qb.best}/{qb.total}</span>
                  )}
                </span>
                <span className="go"><ArrowRight size={17} /></span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="footer">agent_engineering_console · learn → drill → prove</div>
    </>
  );
}
