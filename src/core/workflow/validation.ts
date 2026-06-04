import type { WorkflowGraph, WorkflowNode } from "./types";

export interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
}

export function validateWorkflow(graph: WorkflowGraph): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { nodes, edges } = graph;

  if (nodes.length === 0) {
    issues.push({ severity: "error", message: "Add at least one node." });
    return issues;
  }

  const starts = nodes.filter((n) => n.type === "start");
  const ends = nodes.filter((n) => n.type === "end");

  if (starts.length === 0) {
    issues.push({ severity: "error", message: "Workflow needs a Start node." });
  } else if (starts.length > 1) {
    issues.push({
      severity: "error",
      message: "Only one Start node is allowed.",
    });
  }

  if (ends.length === 0) {
    issues.push({ severity: "warning", message: "No End node — export will use END." });
  }

  const outCount = new Map<string, number>();
  const inCount = new Map<string, number>();
  for (const e of edges) {
    outCount.set(e.source, (outCount.get(e.source) ?? 0) + 1);
    inCount.set(e.target, (inCount.get(e.target) ?? 0) + 1);
  }

  for (const node of nodes) {
    if (node.type === "start" && (outCount.get(node.id) ?? 0) === 0) {
      issues.push({
        severity: "error",
        message: "Start node must connect to another node.",
      });
    }
    if (node.type === "condition") {
      const outgoing = outCount.get(node.id) ?? 0;
      if (outgoing < 2) {
        issues.push({
          severity: "error",
          message: `Condition "${node.id}" needs two outgoing branches (e.g. True / False).`,
        });
      }
      const unlabeled = edges.filter(
        (e) => e.source === node.id && !e.label?.trim()
      );
      if (unlabeled.length > 0) {
        issues.push({
          severity: "warning",
          message: `Label branches from condition "${node.id}" (double-click edges).`,
        });
      }
    }
    if (node.type === "end" && (inCount.get(node.id) ?? 0) === 0) {
      issues.push({
        severity: "warning",
        message: `End node "${node.id}" has no incoming edge.`,
      });
    }
  }

  return issues;
}

export function hasBlockingErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.severity === "error");
}

export function nodeById(
  nodes: WorkflowNode[]
): Map<string, WorkflowNode> {
  return new Map(nodes.map((n) => [n.id, n]));
}

export function edgesBySource(
  edges: WorkflowGraph["edges"]
): Map<string, WorkflowGraph["edges"]> {
  const map = new Map<string, WorkflowGraph["edges"]>();
  for (const edge of edges) {
    const list = map.get(edge.source) ?? [];
    list.push(edge);
    map.set(edge.source, list);
  }
  return map;
}
