"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, useState } from "react";

import { AgentNode } from "@/components/nodes/AgentNode";
import type { AgentNodeType } from "@/core/workflow";
import { AGENT_NODE_TYPE, type FlowEdge } from "@/editor/adapters/react-flow";
import { canConnect } from "@/editor/rules/connection-rules";
import { useWorkflowEditor } from "@/editor/store/workflow-context";

const nodeTypes = { [AGENT_NODE_TYPE]: AgentNode };

function EdgeLabelEditor({
  edge,
  onSave,
  onCancel,
}: {
  edge: FlowEdge;
  onSave: (label: string) => void;
  onCancel: () => void;
}) {
  const initial = String(edge.data?.label ?? edge.label ?? "");
  const [value, setValue] = useState(initial);

  return (
    <div className="fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-2 text-xs text-zinc-500">Branch label (True / False)</p>
      <input
        className="w-64 rounded border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(value);
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
          onClick={() => onSave(value)}
        >
          Save
        </button>
        <button type="button" className="rounded border px-2 py-1 text-xs" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CanvasInner() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { state, dispatch } = useWorkflowEditor();
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const conn: Connection = {
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };
      return canConnect(conn, state.flowNodes, state.flowEdges);
    },
    [state.flowNodes, state.flowEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as AgentNodeType;
      if (!type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      dispatch({ type: "add-node", nodeType: type, position });
    },
    [dispatch, screenToFlowPosition]
  );

  const editingEdge = state.flowEdges.find((e) => e.id === editingEdgeId);

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <ReactFlow
        nodes={state.flowNodes}
        edges={state.flowEdges}
        onNodesChange={(changes) => dispatch({ type: "nodes-change", changes })}
        onEdgesChange={(changes) => dispatch({ type: "edges-change", changes })}
        onConnect={(connection) => dispatch({ type: "connect", connection })}
        isValidConnection={isValidConnection}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onNodeClick={(_, node) =>
          dispatch({ type: "select-node", id: node.id })
        }
        onPaneClick={() => dispatch({ type: "select-node", id: null })}
        onEdgeDoubleClick={(_, edge) => {
          const source = state.flowNodes.find((n) => n.id === edge.source);
          if (source?.data.workflow.type === "condition") {
            setEditingEdgeId(edge.id);
          }
        }}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        className="bg-zinc-100 dark:bg-zinc-950"
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap className="!bg-white dark:!bg-zinc-900" nodeStrokeWidth={3} />
      </ReactFlow>
      {editingEdge && (
        <EdgeLabelEditor
          edge={editingEdge}
          onSave={(label) => {
            dispatch({ type: "update-edge-label", edgeId: editingEdge.id, label });
            setEditingEdgeId(null);
          }}
          onCancel={() => setEditingEdgeId(null)}
        />
      )}
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
