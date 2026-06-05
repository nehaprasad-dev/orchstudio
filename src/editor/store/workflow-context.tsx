"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { toWorkflowGraph } from "../adapters/react-flow";
import {
  clearSavedWorkflow,
  loadSavedWorkflow,
  saveWorkflow,
} from "../persistence/storage";
import {
  editorReducer,
  initialEditorState,
  type EditorAction,
  type EditorState,
} from "./workflow-reducer";

interface WorkflowEditorContextValue {
  state: EditorState;
  dispatch: (action: EditorAction) => void;
}

const WorkflowEditorContext = createContext<WorkflowEditorContextValue | null>(
  null
);

export function WorkflowEditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    dispatch({ type: "hydrate", graph: loadSavedWorkflow() });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const graph = toWorkflowGraph(state.flowNodes, state.flowEdges);
    if (graph.nodes.length === 0) {
      clearSavedWorkflow();
      return;
    }
    const timer = window.setTimeout(() => saveWorkflow(graph), 400);
    return () => window.clearTimeout(timer);
  }, [state.flowNodes, state.flowEdges, state.hydrated]);

  return (
    <WorkflowEditorContext.Provider value={value}>
      {children}
    </WorkflowEditorContext.Provider>
  );
}

export function useWorkflowEditor(): WorkflowEditorContextValue {
  const ctx = useContext(WorkflowEditorContext);
  if (!ctx) {
    throw new Error("useWorkflowEditor must be used within WorkflowEditorProvider");
  }
  return ctx;
}
