# Agent Engineering Console

An interactive, expert-depth knowledge system for going from a data/SQL/BI background to building production AI agents. Seven modules, each with detailed lessons (code, pitfalls, production notes), flashcards, and a quiz. Lessons you'll use every single day are marked with a **daily driver** badge. Progress saves locally on your device.

Built with React + Vite. Deploys as a static site (free on Vercel).

## What's inside

- **Python for AI Engineers** — types/Pydantic, async, resilient I/O, key patterns
- **LLM Fundamentals** — tokens & context, sampling, prompting, structured output
- **Retrieval & RAG** — embeddings, chunking, pipelines, hybrid search, eval
- **Agents** — the agent loop, tool design, memory, multi-agent, MCP, text-to-SQL
- **Frameworks** — Pydantic AI, OpenAI Agents SDK, LangGraph, Claude Agent SDK, how to choose
- **Evaluation & Production** — evals, observability, guardrails, cost & latency
- **Land the Role** — portfolio projects, the AI-engineer interview, agentic coding (Claude Code / Cursor)

Each lesson leads with a **tl;dr** so you can scan fast and expand only what you need. Every module also has a **Watch** tab — an animated walkthrough that plays through each topic's diagrams and worked examples step-by-step, like a narrated explainer (captions, no audio) — and an **Interview** tab with mixed drills: multiple-choice for fast recall plus open "spoken answer" questions, each with a model answer (headline → points to hit → a polished line to say).

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview the production build
```

---

## Deploy to GitHub + Vercel using Claude Code

You can do this entirely by talking to Claude Code from inside this folder. Two phases: push to GitHub, then deploy to Vercel.

### Phase 1 — GitHub

Open Claude Code in this project folder and give it this:

> "Initialize a git repo here, commit everything, create a new public GitHub repo called `agent-knowledge-console` using the `gh` CLI, and push to it."

Claude Code will run roughly:

```bash
git init
git add .
git commit -m "Initial commit: agent engineering console"
gh repo create agent-knowledge-console --public --source=. --remote=origin --push
```

(If `gh` is not installed/authenticated, run `gh auth login` once, or create the repo on github.com and `git remote add origin <url>` then `git push -u origin main`.)

### Phase 2 — Vercel

Then tell Claude Code:

> "Deploy this Vite app to Vercel as a production deployment using the Vercel CLI."

Claude Code will run roughly:

```bash
npm install -g vercel
vercel login          # one-time, opens browser
vercel                # first deploy: accept the detected Vite settings
vercel --prod         # promote to production, prints your live URL
```

Vercel auto-detects Vite (build `npm run build`, output `dist/`). The included `vercel.json` handles SPA routing and asset caching, so no extra config is needed.

### Even simpler: connect the repo in the Vercel dashboard

Once it is on GitHub, go to vercel.com → New Project → import `agent-knowledge-console`. Vercel auto-detects Vite and gives you automatic deploys on every push to `main`. No CLI required.

---

## Customizing the content

All learning content lives in one file: **`src/data/curriculum.js`**. To add a lesson, flashcard, or quiz question, edit the relevant module's array. Section types inside a lesson body:

- `{ h: "Subhead" }`
- `{ p: "Paragraph. Supports **bold** and \`code\`." }`
- `{ code: "...", lang: "python" }`
- `{ steps: ["item one", "item two"] }`
- `{ note: "...", kind: "pitfall" | "pro" | "tip" }`
- `{ flow: { dir?: "row"|"col", loop?: "label", steps: [{ t, d?, hot? }] } }` — boxes-and-arrows diagram (pipelines, the agent loop, round-trips)
- `{ compare: { caption?, cols: [{ title, accent?: "amber"|"green"|"blue"|"red", items: [...] }] } }` — side-by-side comparison cards
- `{ budget: { total: "caption", parts: [{ label, v, reserved? }] } }` — proportional stacked bar (e.g. the token budget)
- `{ example: { title?, steps: [{ t, io, hot? }] } }` — worked-example timeline showing the real data at each step

Add `daily: true` to a lesson object (alongside `title`/`tldr`) to give it the **daily driver** badge for skills used every single day.

You can hand this file to Claude Code with a prompt like "add a 4th lesson to the Agents module on planning and reflection patterns, matching the existing format" and it will extend it for you.

## Notes

- No backend, no API keys, no secrets. Pure static site, safe to make public.
- Progress is stored in `localStorage` (per browser/device). The **reset** button clears it.
