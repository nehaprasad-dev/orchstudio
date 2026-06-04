"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

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

export function useWorkflowDispatch() {
  return useWorkflowEditor().dispatch;
}

export function useWorkflowState(): EditorState {
  return useWorkflowEditor().state;
}

export function useWorkflowSelector<T>(selector: (s: EditorState) => T): T {
  const { state } = useWorkflowEditor();
  return selector(state);
}
