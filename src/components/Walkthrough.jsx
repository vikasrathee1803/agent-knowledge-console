import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowRight } from "lucide-react";

// Assemble a flat list of "scenes" from a module's lessons: an intro per lesson,
// then one scene per step of every flow / worked-example diagram it contains.
function buildScenes(module) {
  const scenes = [];
  for (const lesson of module.lessons) {
    scenes.push({ kind: "intro", lesson, caption: "" });
    for (const sec of lesson.body) {
      if (sec.flow) {
        sec.flow.steps.forEach((st, i) =>
          scenes.push({
            kind: "flow",
            lesson,
            data: sec.flow,
            active: i,
            caption: st.t + (st.d ? " — " + st.d : ""),
          })
        );
      }
      if (sec.example) {
        sec.example.steps.forEach((st, i) =>
          scenes.push({
            kind: "example",
            lesson,
            data: sec.example,
            active: i,
            caption: st.t,
          })
        );
      }
    }
  }
  return scenes;
}

const DUR = { intro: 4500, flow: 3000, example: 3600 };

function SceneView({ scene }) {
  if (scene.kind === "intro") {
    return (
      <div className="wt-intro">
        <span className="wt-intro-lbl">the big idea</span>
        <p className="wt-intro-tldr">{scene.lesson.tldr}</p>
      </div>
    );
  }

  if (scene.kind === "flow") {
    const { steps, dir = "row" } = scene.data;
    return (
      <div className={"flow flow-" + dir + " wt-flow"}>
        {steps.map((s, idx) => (
          <Fragment key={idx}>
            <div
              className={
                "flow-node" +
                (s.hot ? " hot" : "") +
                (idx === scene.active ? " on" : idx > scene.active ? " dim" : "")
              }
            >
              <span className="flow-t">{s.t}</span>
              {s.d && <span className="flow-d">{s.d}</span>}
            </div>
            {idx < steps.length - 1 && (
              <span className={"flow-arrow" + (idx < scene.active ? " lit" : "")} aria-hidden="true">
                <ArrowRight size={15} />
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  }

  if (scene.kind === "example") {
    const { steps, title } = scene.data;
    return (
      <div className="ex wt-ex">
        {title && <div className="ex-title">{title}</div>}
        <div className="ex-steps">
          {steps.map((s, idx) => (
            <div
              className={
                "ex-step" +
                (s.hot ? " hot" : "") +
                (idx === scene.active ? " on" : idx > scene.active ? " dim" : "")
              }
              key={idx}
            >
              <span className="ex-dot" aria-hidden="true" />
              <div className="ex-label">{s.t}</div>
              {idx <= scene.active && (
                <pre className="ex-io">
                  <code>{s.io}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function Walkthrough({ module }) {
  const scenes = useMemo(() => buildScenes(module), [module]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const scene = scenes[i];
  const atEnd = i >= scenes.length - 1;

  useEffect(() => {
    clearTimeout(timer.current);
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    const dur = DUR[scene.kind] || 3000;
    timer.current = setTimeout(() => setI((n) => Math.min(n + 1, scenes.length - 1)), dur);
    return () => clearTimeout(timer.current);
  }, [i, playing, atEnd, scene, scenes.length]);

  const go = (n) => setI(Math.max(0, Math.min(n, scenes.length - 1)));
  const restart = () => {
    setI(0);
    setPlaying(true);
  };

  const pct = ((i + 1) / scenes.length) * 100;

  return (
    <div className="wt">
      <div className="wt-now">
        <span className="wt-kicker">now explaining</span>
        <span className="wt-lesson">{scene.lesson.title}</span>
      </div>

      <div className="wt-stage">
        <SceneView scene={scene} />
      </div>

      <div className="wt-caption">{scene.caption || " "}</div>

      <div className="wt-bar">
        <div className="wt-fill" style={{ width: pct + "%" }} />
      </div>

      <div className="wt-ctrl">
        <button className="wt-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="previous">
          <SkipBack size={16} />
        </button>
        {atEnd ? (
          <button className="wt-btn main" onClick={restart} aria-label="replay">
            <RotateCcw size={18} />
          </button>
        ) : (
          <button className="wt-btn main" onClick={() => setPlaying((p) => !p)} aria-label="play or pause">
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
        )}
        <button className="wt-btn" onClick={() => go(i + 1)} disabled={atEnd} aria-label="next">
          <SkipForward size={16} />
        </button>
        <span className="wt-count">
          {i + 1} / {scenes.length}
        </span>
      </div>
    </div>
  );
}
