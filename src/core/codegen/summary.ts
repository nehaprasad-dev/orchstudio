import { NODE_LABELS } from "../workflow/node-defaults";
import type { WorkflowGraph } from "../workflow/types";
import {
  isConditionConfig,
  isHumanConfig,
  isLlmConfig,
  isToolConfig,
} from "../workflow/types";

function describeNode(node: WorkflowGraph["nodes"][number]): string {
  const label = NODE_LABELS[node.type];
  switch (node.type) {
    case "llm":
      return isLlmConfig(node.config)
        ? `${label} (${node.config.provider})`
        : label;
    case "tool":
      return isToolConfig(node.config)
        ? `${label}: ${node.config.toolName}`
        : label;
    case "condition":
      return isConditionConfig(node.config)
        ? `${label}: ${node.config.conditionExpression}`
        : label;
    case "human":
      return isHumanConfig(node.config)
        ? `${label}: ${node.config.approvalMessage.slice(0, 48)}`
        : label;
    default:
      return label;
  }
}

export function buildWorkflowSummary(graph: WorkflowGraph): string {
  const lines = [
    "Workflow map:",
    `  Nodes: ${graph.nodes.length} | Edges: ${graph.edges.length}`,
    "",
  ];
  for (const node of graph.nodes) {
    lines.push(`  - ${node.id}: ${describeNode(node)}`);
  }
  lines.push("");
  lines.push("Edges:");
  for (const edge of graph.edges) {
    const branch = edge.label ? ` [${edge.label}]` : "";
    lines.push(`  - ${edge.source} → ${edge.target}${branch}`);
  }
  return lines.join("\n");
}
