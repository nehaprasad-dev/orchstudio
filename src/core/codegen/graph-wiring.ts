import { lines } from "./emit";
import { edgesBySource, nodeById } from "../workflow/validation";
import type { WorkflowGraph, WorkflowNode } from "../workflow/types";
import { isConditionConfig } from "../workflow/types";

export function buildGraphWiring(
  graph: WorkflowGraph,
  idToPy: Map<string, string>
): string {
  const body: string[] = ["workflow = StateGraph(AgentState)", ""];
  const nodes = nodeById(graph.nodes);
  const outgoing = edgesBySource(graph.edges);

  for (const node of graph.nodes) {
    const py = idToPy.get(node.id)!;
    body.push(`workflow.add_node("${py}", ${py})`);
  }
  body.push("");

  const start = graph.nodes.find((n) => n.type === "start");
  if (start) {
    body.push(`workflow.add_edge(START, "${idToPy.get(start.id)}")`);
  }

  for (const node of graph.nodes) {
    if (node.type === "end") continue;

    const py = idToPy.get(node.id)!;
    const edges = outgoing.get(node.id) ?? [];

    if (node.type === "condition") {
      body.push(...buildConditionalEdges(node, edges, nodes, idToPy));
      continue;
    }

    for (const edge of edges) {
      const target = nodes.get(edge.target);
      if (!target) continue;
      if (target.type === "end") {
        body.push(`workflow.add_edge("${py}", END)`);
      } else {
        body.push(`workflow.add_edge("${py}", "${idToPy.get(edge.target)}")`);
      }
    }
  }

  return body.join("\n");
}

function buildConditionalEdges(
  node: WorkflowNode,
  edges: WorkflowGraph["edges"],
  nodes: Map<string, WorkflowNode>,
  idToPy: Map<string, string>
): string[] {
  const py = idToPy.get(node.id)!;
  const routeName = `route_${py}`;
  const expr = isConditionConfig(node.config)
    ? node.config.conditionExpression
    : "True";

  const keys = edges.map((e, i) => e.label?.trim() || `branch_${i}`);
  const trueKey = keys[0] ?? "True";
  const falseKey = keys[1] ?? "False";

  const pathEntries = edges.map((edge, index) => {
    const key = edge.label?.trim() || `branch_${index}`;
    const target = nodes.get(edge.target);
    const dest =
      target?.type === "end" ? "END" : `"${idToPy.get(edge.target)}"`;
    return `        "${key}": ${dest},`;
  });

  return lines(
    `def ${routeName}(state: AgentState) -> str:`,
    `    return "${trueKey}" if bool(${expr}) else "${falseKey}"`,
    "",
    "workflow.add_conditional_edges(",
    `    "${py}",`,
    `    ${routeName},`,
    "    {",
    ...pathEntries,
    "    },",
    ")",
  ).split("\n");
}

export function buildCompileBlock(humanNodePyNames: string[]): string {
  if (humanNodePyNames.length === 0) {
    return "return workflow.compile()";
  }
  return lines(
    "memory = MemorySaver()",
    "return workflow.compile(",
    "    checkpointer=memory,",
    `    interrupt_before=[${humanNodePyNames.map((n) => `"${n}"`).join(", ")}],`,
    ")",
  );
}
