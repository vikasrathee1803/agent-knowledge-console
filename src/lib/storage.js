// Simple, resilient progress storage backed by localStorage.
// Works on any static host (Vercel included). No backend required.

const KEY = "agentconsole:v2";

const empty = () => ({ done: {}, quiz: {}, cards: {} });

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked; fail silently */
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

// --- Weak spots: MCQs you got wrong, kept in a SEPARATE key so progress
// writes can't clobber them. Keyed by question text. ----------------------
const WEAK_KEY = "agentconsole:weak:v1";

export function loadWeak() {
  try {
    return JSON.parse(localStorage.getItem(WEAK_KEY)) || {};
  } catch {
    return {};
  }
}

// correct === true removes it (mastered); false records/increments a miss.
export function recordAnswer(key, correct) {
  try {
    const w = loadWeak();
    if (correct) {
      delete w[key];
    } else {
      w[key] = { misses: ((w[key] && w[key].misses) || 0) + 1, ts: Date.now() };
    }
    localStorage.setItem(WEAK_KEY, JSON.stringify(w));
  } catch {
    /* ignore */
  }
}

export function clearWeak() {
  try {
    localStorage.removeItem(WEAK_KEY);
  } catch {
    /* ignore */
  }
}
