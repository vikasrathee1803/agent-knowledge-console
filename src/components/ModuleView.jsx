import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ICONS } from "./icons.js";
import Lesson from "./Lesson.jsx";
import Flashcards from "./Flashcards.jsx";
import Quiz from "./Quiz.jsx";

export default function ModuleView({ module, progress, onBack, onToggleLesson, onFinishQuiz }) {
  const [mode, setMode] = useState("lessons");
  const Icon = ICONS[module.icon];

  return (
    <>
      <button className="back" onClick={onBack}>
        <ChevronLeft size={15} /> all modules
      </button>

      <div className="mhead">
        <div className="cicon" style={{ marginBottom: 0 }}>{Icon && <Icon size={20} />}</div>
        <div>
          <h2 className="mh1">{module.name}</h2>
          <p className="mblurb">{module.blurb}</p>
        </div>
      </div>

      <div className="tabs">
        {[
          ["lessons", "Lessons"],
          ["cards", "Flashcards"],
          ["quiz", "Quiz"],
        ].map(([k, label]) => (
          <button key={k} className={"tab" + (mode === k ? " on" : "")} onClick={() => setMode(k)}>
            {label}
          </button>
        ))}
      </div>

      {mode === "lessons" &&
        module.lessons.map((l) => (
          <Lesson
            key={l.id}
            lesson={l}
            done={!!progress.done[l.id]}
            onToggle={() => onToggleLesson(l.id)}
          />
        ))}

      {mode === "cards" && <Flashcards key={module.id} cards={module.flashcards} />}

      {mode === "quiz" && (
        <Quiz
          key={module.id}
          quiz={module.quiz}
          best={progress.quiz[module.id]?.best ?? null}
          onFinish={(s, t) => onFinishQuiz(module.id, s, t)}
        />
      )}
    </>
  );
}
