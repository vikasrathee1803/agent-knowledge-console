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
