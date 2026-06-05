import type { AgentNodeType, WorkflowEdge, WorkflowGraph, WorkflowNode } from "./types";

const FORMAT_VERSION = 1;

const NODE_TYPES: AgentNodeType[] = [
  "start",
  "llm",
  "tool",
  "condition",
  "human",
  "end",
];

interface SerializedWorkflow {
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

function isNodeType(value: string): value is AgentNodeType {
  return NODE_TYPES.includes(value as AgentNodeType);
}

export function serializeWorkflow(graph: WorkflowGraph): string {
  const payload: SerializedWorkflow = {
    version: FORMAT_VERSION,
    nodes: graph.nodes,
    edges: graph.edges,
  };
  return JSON.stringify(payload, null, 2);
}

export function parseWorkflow(json: string): WorkflowGraph | { error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { error: "Invalid JSON file." };
  }

  if (!raw || typeof raw !== "object") {
    return { error: "Workflow must be a JSON object." };
  }

  const data = raw as Partial<SerializedWorkflow>;
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return { error: "Workflow must include nodes and edges arrays." };
  }

  const nodes: WorkflowNode[] = [];
  for (const item of data.nodes) {
    const parsed = parseNode(item);
    if ("error" in parsed) return parsed;
    nodes.push(parsed);
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges: WorkflowEdge[] = [];

  for (const item of data.edges) {
    const parsed = parseEdge(item, nodeIds);
    if ("error" in parsed) return parsed;
    edges.push(parsed);
  }

  return { nodes, edges };
}

function parseNode(item: unknown): WorkflowNode | { error: string } {
  if (!item || typeof item !== "object") {
    return { error: "Each node must be an object." };
  }
  const n = item as Record<string, unknown>;
  if (typeof n.id !== "string" || typeof n.type !== "string") {
    return { error: "Node requires id and type." };
  }
  if (!isNodeType(n.type)) {
    return { error: `Unknown node type: ${n.type}` };
  }
  const position = n.position as { x?: unknown; y?: unknown } | undefined;
  if (
    !position ||
    typeof position.x !== "number" ||
    typeof position.y !== "number"
  ) {
    return { error: `Node ${n.id} needs a numeric position.` };
  }
  return {
    id: n.id,
    type: n.type,
    position: { x: position.x, y: position.y },
    config: (n.config && typeof n.config === "object" ? n.config : {}) as WorkflowNode["config"],
  };
}

function parseEdge(
  item: unknown,
  nodeIds: Set<string>
): WorkflowEdge | { error: string } {
  if (!item || typeof item !== "object") {
    return { error: "Each edge must be an object." };
  }
  const e = item as Record<string, unknown>;
  if (
    typeof e.id !== "string" ||
    typeof e.source !== "string" ||
    typeof e.target !== "string"
  ) {
    return { error: "Edge requires id, source, and target." };
  }
  if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
    return { error: `Edge ${e.id} references a missing node.` };
  }
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: typeof e.label === "string" ? e.label : undefined,
  };
}
