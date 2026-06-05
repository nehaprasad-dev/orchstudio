"use client";

import { validateWorkflow } from "@/core/workflow";
import { toWorkflowGraph } from "@/editor/adapters/react-flow";
import { useWorkflowEditor } from "@/editor/store/workflow-context";
import { cn } from "@/core/style";

export function WorkflowStatus() {
  const { state } = useWorkflowEditor();
  const graph = toWorkflowGraph(state.flowNodes, state.flowEdges);
  const issues = validateWorkflow(graph);
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const status =
    graph.nodes.length === 0
      ? "empty"
      : errors.length > 0
        ? "error"
        : warnings.length > 0
          ? "warning"
          : "ready";

  const statusLabel = {
    empty: "Start building",
    error: "Fix errors to export",
    warning: "Exportable with warnings",
    ready: "Ready to export",
  }[status];

  return (
    <section className="space-y-2 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          Graph health
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-medium",
            status === "ready" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
            status === "warning" && "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
            status === "error" && "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
            status === "empty" && "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          )}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-xs text-zinc-500">
        {graph.nodes.length} nodes · {graph.edges.length} edges
      </p>
      {issues.length > 0 && graph.nodes.length > 0 && (
        <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
          {issues.slice(0, 4).map((issue) => (
            <li
              key={issue.message}
              className={issue.severity === "error" ? "text-red-700 dark:text-red-300" : ""}
            >
              {issue.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
