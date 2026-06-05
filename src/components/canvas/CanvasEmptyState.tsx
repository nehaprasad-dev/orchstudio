"use client";

export function CanvasEmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-8">
      <div className="max-w-md rounded-xl border border-dashed border-zinc-300 bg-white/80 px-8 py-10 text-center shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          See your agent before you ship it
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Drag nodes from the left palette, connect the flow, then export
          LangGraph Python. Your workflow auto-saves in this browser.
        </p>
        <ol className="mt-4 space-y-1 text-left text-xs text-zinc-500">
          <li>1. Drag <strong>Start</strong> and <strong>LLM Call</strong> onto the canvas</li>
          <li>2. Connect handles — click a node to configure it</li>
          <li>3. Hit <strong>Export Code</strong> when graph health is green</li>
        </ol>
      </div>
    </div>
  );
}
