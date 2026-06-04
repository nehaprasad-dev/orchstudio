import type { Connection, Edge, Node } from "@xyflow/react";

import type { WorkflowEdge, WorkflowGraph, WorkflowNode } from "@/core/workflow";

export const AGENT_NODE_TYPE = "agentNode" as const;

export interface FlowNodeData {
  workflow: WorkflowNode;
  [key: string]: unknown;
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge<{ label?: string }>;

export function toFlowNodes(nodes: WorkflowNode[]): FlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: AGENT_NODE_TYPE,
    position: node.position,
    data: { workflow: node },
  }));
}

export function toFlowEdges(edges: WorkflowEdge[]): FlowEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    data: edge.label ? { label: edge.label } : undefined,
    label: edge.label,
  }));
}

export function fromFlowNode(node: FlowNode): WorkflowNode {
  return node.data.workflow;
}

export function fromFlowNodes(nodes: FlowNode[]): WorkflowNode[] {
  return nodes.map(fromFlowNode);
}

export function fromFlowEdge(edge: FlowEdge): WorkflowEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.data?.label,
  };
}

export function fromFlowEdges(edges: FlowEdge[]): WorkflowEdge[] {
  return edges.map(fromFlowEdge);
}

export function toWorkflowGraph(nodes: FlowNode[], edges: FlowEdge[]): WorkflowGraph {
  return {
    nodes: fromFlowNodes(nodes),
    edges: fromFlowEdges(edges),
  };
}

export function createFlowEdge(connection: Connection): FlowEdge {
  const id = `edge-${connection.source}-${connection.target}-${Date.now()}`;
  return {
    id,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
  };
}

export function createFlowNode(
  type: WorkflowNode["type"],
  position: { x: number; y: number },
  id: string,
  config: WorkflowNode["config"]
): FlowNode {
  return {
    id,
    type: AGENT_NODE_TYPE,
    position,
    data: {
      workflow: { id, type, position, config },
    },
  };
}
