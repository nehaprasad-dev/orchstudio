"use client";

import { useRef } from "react";

import { parseWorkflow, serializeWorkflow } from "@/core/workflow/serialize";
import { toWorkflowGraph } from "@/editor/adapters/react-flow";
import { useWorkflowEditor } from "@/editor/store/workflow-context";
import { Button } from "@/ui/primitives";

export function WorkflowIO() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useWorkflowEditor();

  const downloadJson = () => {
    const graph = toWorkflowGraph(state.flowNodes, state.flowEdges);
    const blob = new Blob([serializeWorkflow(graph)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "workflow.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = parseWorkflow(text);
      if ("error" in parsed) {
        dispatch({
          type: "export-result",
          code: "",
          errors: [parsed.error],
        });
        return;
      }
      dispatch({ type: "load-graph", graph: parsed });
      dispatch({ type: "export-result", code: "", errors: [] });
    };
    reader.readAsText(file);
  };

  return (
    <section className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Share workflow
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 text-xs" onClick={downloadJson}>
          Save JSON
        </Button>
        <Button
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => inputRef.current?.click()}
        >
          Load JSON
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) importJson(file);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-zinc-500">
        Share your graph as a file — no account needed.
      </p>
    </section>
  );
}
