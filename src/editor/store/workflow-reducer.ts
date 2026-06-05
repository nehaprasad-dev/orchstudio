import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";

import { createDefaultConfig } from "@/core/workflow";
import type {
  AgentNodeConfig,
  AgentNodeType,
  WorkflowGraph,
  WorkflowNode,
} from "@/core/workflow";
import type { FlowEdge, FlowNode } from "../adapters/react-flow";
import {
  createFlowEdge,
  createFlowNode,
  toFlowEdges,
  toFlowNodes,
} from "../adapters/react-flow";

let nodeCounter = 0;

function nextId(type: AgentNodeType): string {
  nodeCounter += 1;
  return `${type}-${nodeCounter}`;
}

function syncNodeCounter(nodes: WorkflowNode[]): void {
  let max = 0;
  for (const node of nodes) {
    const match = node.id.match(/-(\d+)$/);
    if (match) max = Math.max(max, Number.parseInt(match[1], 10));
  }
  nodeCounter = max;
}

function syncNodePositions(nodes: FlowNode[]): FlowNode[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      workflow: {
        ...node.data.workflow,
        position: node.position,
      },
    },
  }));
}

export interface EditorState {
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  selectedNodeId: string | null;
  sidebarCollapsed: boolean;
  exportOpen: boolean;
  exportCode: string;
  exportErrors: string[];
  hydrated: boolean;
}

export const initialEditorState: EditorState = {
  flowNodes: [],
  flowEdges: [],
  selectedNodeId: null,
  sidebarCollapsed: false,
  exportOpen: false,
  exportCode: "",
  exportErrors: [],
  hydrated: false,
};

export type EditorAction =
  | { type: "nodes-change"; changes: NodeChange<FlowNode>[] }
  | { type: "edges-change"; changes: EdgeChange<FlowEdge>[] }
  | { type: "connect"; connection: Connection }
  | { type: "select-node"; id: string | null }
  | { type: "add-node"; nodeType: AgentNodeType; position: { x: number; y: number } }
  | { type: "update-config"; nodeId: string; config: AgentNodeConfig }
  | { type: "update-edge-label"; edgeId: string; label: string }
  | { type: "load-graph"; graph: WorkflowGraph }
  | { type: "hydrate"; graph: WorkflowGraph | null }
  | { type: "clear" }
  | { type: "sidebar-collapsed"; collapsed: boolean }
  | { type: "export-open"; open: boolean }
  | { type: "export-result"; code: string; errors: string[] };

export function editorReducer(
  state: EditorState,
  action: EditorAction
): EditorState {
  switch (action.type) {
    case "hydrate":
      if (action.graph) {
        syncNodeCounter(action.graph.nodes);
        return {
          ...state,
          flowNodes: toFlowNodes(action.graph.nodes),
          flowEdges: toFlowEdges(action.graph.edges),
          hydrated: true,
        };
      }
      return { ...state, hydrated: true };
    case "nodes-change":
      return {
        ...state,
        flowNodes: syncNodePositions(
          applyNodeChanges(action.changes, state.flowNodes) as FlowNode[]
        ),
      };
    case "edges-change":
      return {
        ...state,
        flowEdges: applyEdgeChanges(action.changes, state.flowEdges) as FlowEdge[],
      };
    case "connect":
      return {
        ...state,
        flowEdges: [...state.flowEdges, createFlowEdge(action.connection)],
      };
    case "select-node":
      return { ...state, selectedNodeId: action.id };
    case "add-node": {
      const id = nextId(action.nodeType);
      const node = createFlowNode(
        action.nodeType,
        action.position,
        id,
        createDefaultConfig(action.nodeType)
      );
      return { ...state, flowNodes: [...state.flowNodes, node] };
    }
    case "update-config":
      return {
        ...state,
        flowNodes: state.flowNodes.map((n) =>
          n.id === action.nodeId
            ? {
                ...n,
                data: {
                  workflow: { ...n.data.workflow, config: action.config },
                },
              }
            : n
        ),
      };
    case "update-edge-label":
      return {
        ...state,
        flowEdges: state.flowEdges.map((e) =>
          e.id === action.edgeId
            ? {
                ...e,
                label: action.label,
                data: { label: action.label },
              }
            : e
        ),
      };
    case "load-graph":
      syncNodeCounter(action.graph.nodes);
      return {
        ...state,
        flowNodes: toFlowNodes(action.graph.nodes),
        flowEdges: toFlowEdges(action.graph.edges),
        selectedNodeId: null,
        exportErrors: [],
      };
    case "clear":
      nodeCounter = 0;
      return {
        ...initialEditorState,
        sidebarCollapsed: state.sidebarCollapsed,
        hydrated: true,
      };
    case "sidebar-collapsed":
      return { ...state, sidebarCollapsed: action.collapsed };
    case "export-open":
      return { ...state, exportOpen: action.open };
    case "export-result":
      return {
        ...state,
        exportCode: action.code,
        exportErrors: action.errors,
        exportOpen: action.errors.length === 0,
      };
    default:
      return state;
  }
}
