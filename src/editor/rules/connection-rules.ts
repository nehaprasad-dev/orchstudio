import type { Connection } from "@xyflow/react";

import type { FlowEdge, FlowNode } from "../adapters/react-flow";

export function canConnect(
  connection: Connection,
  nodes: FlowNode[],
  edges: FlowEdge[]
): boolean {
  const source = nodes.find((n) => n.id === connection.source);
  const target = nodes.find((n) => n.id === connection.target);
  if (!source || !target) return false;

  const sourceType = source.data.workflow.type;
  const targetType = target.data.workflow.type;

  if (targetType === "start") return false;
  if (sourceType === "end") return false;

  if (sourceType === "start") {
    const hasOutgoing = edges.some((e) => e.source === source.id);
    if (hasOutgoing) return false;
  }

  return true;
}
