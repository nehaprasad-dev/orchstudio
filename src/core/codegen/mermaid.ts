import type { WorkflowGraph } from "../workflow/types";

export function buildMermaidComment(graph: WorkflowGraph): string {
  const lines = ["# --- Workflow diagram ---", "```mermaid", "flowchart LR"];
  for (const node of graph.nodes) {
    lines.push(`    ${node.id}["${node.type}"]`);
  }
  for (const edge of graph.edges) {
    const label = edge.label ? `|${edge.label}|` : "";
    lines.push(`    ${edge.source} -->${label} ${edge.target}`);
  }
  lines.push("```");
  return lines.join("\n");
}
