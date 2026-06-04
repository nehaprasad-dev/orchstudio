"use client";

import { useWorkflowEditor } from "@/editor/store/workflow-context";
import { Button, Modal } from "@/ui/primitives";

export function ExportDialog() {
  const { state, dispatch } = useWorkflowEditor();

  const copy = async () => {
    await navigator.clipboard.writeText(state.exportCode);
  };

  const download = () => {
    const blob = new Blob([state.exportCode], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "agent_workflow.py";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={state.exportOpen}
      onClose={() => dispatch({ type: "export-open", open: false })}
      title="Exported LangGraph Python"
    >
      <div className="flex gap-2">
        <Button variant="outline" onClick={copy}>
          Copy
        </Button>
        <Button variant="outline" onClick={download}>
          Download .py
        </Button>
      </div>
      <pre className="mt-4 max-h-[60vh] overflow-auto rounded-md bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
        <code>{state.exportCode}</code>
      </pre>
    </Modal>
  );
}
