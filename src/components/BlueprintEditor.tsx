"use client";

import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { NodeConfigSheet } from "@/components/config/NodeConfigSheet";
import { ExportDialog } from "@/components/export/ExportDialog";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { WorkflowEditorProvider } from "@/editor/store/workflow-context";

export function BlueprintEditor() {
  return (
    <WorkflowEditorProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <WorkflowCanvas />
        </main>
        <NodeConfigSheet />
        <ExportDialog />
      </div>
    </WorkflowEditorProvider>
  );
}
