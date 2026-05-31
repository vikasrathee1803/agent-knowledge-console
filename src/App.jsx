import { useState, useEffect, useMemo } from "react";
import { Layers } from "lucide-react";
import { MODULES, TOTAL_LESSONS } from "./data/curriculum.js";
import { loadProgress, saveProgress, resetProgress } from "./lib/storage.js";
import Home from "./components/Home.jsx";
import ModuleView from "./components/ModuleView.jsx";
import MixedDrill from "./components/MixedDrill.jsx";

export default function App() {
  const [progress, setProgress] = useState({ done: {}, quiz: {}, cards: {} });
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [mixed, setMixed] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveProgress(progress);
  }, [progress, loaded]);

  const toggleLesson = (id) =>
    setProgress((p) => ({ ...p, done: { ...p.done, [id]: !p.done[id] } }));

  const finishQuiz = (mId, score, total) =>
    setProgress((p) => {
      const prev = p.quiz[mId]?.best ?? -1;
      return { ...p, quiz: { ...p.quiz, [mId]: { best: Math.max(prev, score), total } } };
    });

  const reset = () => {
    if (confirm("Reset all progress on this device?")) {
      resetProgress();
      setProgress({ done: {}, quiz: {}, cards: {} });
    }
  };

  const overall = useMemo(() => {
    const dn = Object.values(progress.done).filter(Boolean).length;
    return Math.round((dn / TOTAL_LESSONS) * 100);
  }, [progress]);

  const active = MODULES.find((m) => m.id === activeId);

  return (
    <>
      <div className="grain" />
      <div className="wrap">
        <div className="top">
          <div className="brand">
            <div className="mark"><Layers size={18} /></div>
            <div>
              <div className="bname">Knowledge Console</div>
              <div className="btitle">agent_engineering</div>
            </div>
          </div>
          <div className="ring">
            <div className="lbl">overall<br />mastery</div>
            <div className="pct">{overall}%</div>
            <button className="reset" onClick={reset}>reset</button>
          </div>
        </div>

        {mixed ? (
          <MixedDrill onBack={() => setMixed(false)} />
        ) : !active ? (
          <Home
            modules={MODULES}
            totalLessons={TOTAL_LESSONS}
            progress={progress}
            onOpen={setActiveId}
            onMixed={() => setMixed(true)}
          />
        ) : (
          <ModuleView
            module={active}
            progress={progress}
            onBack={() => setActiveId(null)}
            onToggleLesson={toggleLesson}
            onFinishQuiz={finishQuiz}
          />
        )}
      </div>
    </>
  );
}
