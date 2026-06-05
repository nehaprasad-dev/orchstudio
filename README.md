# Agent Blueprint

Visual editor for LangGraph workflows. Design on a canvas, configure nodes, export Python.

## Architecture

```
src/
  core/                 # Pure TypeScript — no React, no React Flow
    workflow/           # Domain model, validation, examples
    codegen/            # LangGraph Python generation
  editor/               # Canvas integration boundary
    adapters/           # React Flow ↔ domain graph
    store/              # useReducer state (no external store library)
    rules/              # Connection validation
  components/           # UI composition
  ui/                   # Native HTML primitives (no component library)
```

**Why this split:** `core` can be tested and reused without the UI. `editor` owns everything that exists because of React Flow. Generated Python only reads `WorkflowGraph`, not canvas types.

## Dependencies (intentional)

| Package | Role |
|---------|------|
| Next.js + React | App shell |
| `@xyflow/react` | Node canvas (product requirement) |

No UI kit, global state library, syntax highlighter, or icon pack.

## Commands

```bash
npm install
npm run dev
npm run build
npm run test:codegen
./scripts/install-git-hooks.sh   # strips Cursor co-author from future commits
```

In Cursor: **Settings → Agents → Attribution → Off** so `cursoragent` is not added as a co-author on GitHub.

## Product features

- **Graph health** — Live validation in the sidebar (errors block export)
- **Auto-save** — Workflow persists in `localStorage`
- **Share JSON** — Export/import `.json` workflow files without a backend
- **Self-documenting code** — Exported Python includes a workflow map + Mermaid diagram

## Export rules

Export runs `validateWorkflow` first. Errors (missing Start, condition without two branches) block the modal and show inline in the sidebar.

## Deploy

Static-friendly Next.js app — deploy to Vercel with `npm run build`.
