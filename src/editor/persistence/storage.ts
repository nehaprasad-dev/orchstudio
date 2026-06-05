import type { WorkflowGraph } from "@/core/workflow";
import { parseWorkflow } from "@/core/workflow/serialize";

const STORAGE_KEY = "agent-blueprint:workflow";

export function loadSavedWorkflow(): WorkflowGraph | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = parseWorkflow(raw);
  if ("error" in parsed) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return parsed;
}

export function saveWorkflow(graph: WorkflowGraph): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    version: 1,
    nodes: graph.nodes,
    edges: graph.edges,
  });
  localStorage.setItem(STORAGE_KEY, payload);
}

export function clearSavedWorkflow(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
