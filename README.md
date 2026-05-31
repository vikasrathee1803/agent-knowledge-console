# Agent Engineering Console

An interactive, expert-depth knowledge system for going from a data/SQL/BI background to building production AI agents. Six modules, each with detailed lessons (code, pitfalls, production notes), flashcards, and a quiz. Progress saves locally on your device.

Built with React + Vite. Deploys as a static site (free on Vercel).

## What's inside

- **Python for AI Engineers** — types/Pydantic, async, resilient I/O, key patterns
- **LLM Fundamentals** — tokens & context, sampling, prompting, structured output
- **Retrieval & RAG** — embeddings, chunking, pipelines, hybrid search, eval
- **Agents** — the agent loop, tool design, memory, multi-agent, MCP
- **Frameworks** — Pydantic AI, LangGraph, CrewAI, Claude Agent SDK, how to choose
- **Evaluation & Production** — evals, observability, guardrails, cost & latency

Each lesson leads with a **tl;dr** so you can scan fast and expand only what you need.

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

You can hand this file to Claude Code with a prompt like "add a 4th lesson to the Agents module on planning and reflection patterns, matching the existing format" and it will extend it for you.

## Notes

- No backend, no API keys, no secrets. Pure static site, safe to make public.
- Progress is stored in `localStorage` (per browser/device). The **reset** button clears it.
