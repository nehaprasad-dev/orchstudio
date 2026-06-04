"use client";

import { generatePython } from "@/core/codegen";
import { EXAMPLE_WORKFLOWS } from "@/core/workflow";
import { cn } from "@/core/style";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMoon,
  IconSun,
  IconTrash,
} from "@/editor/icons";
import { toWorkflowGraph } from "@/editor/adapters/react-flow";
import { useTheme } from "@/editor/theme/use-theme";
import { useWorkflowEditor } from "@/editor/store/workflow-context";
import { NodePalette } from "@/components/palette/NodePalette";
import { Button, Divider } from "@/ui/primitives";

export function Sidebar() {
  const { theme, toggle } = useTheme();
  const { state, dispatch } = useWorkflowEditor();

  const handleExport = () => {
    const graph = toWorkflowGraph(state.flowNodes, state.flowEdges);
    const result = generatePython(graph);
    if (!result.ok) {
      dispatch({
        type: "export-result",
        code: "",
        errors: result.issues,
      });
      return;
    }
    dispatch({
      type: "export-result",
      code: result.code,
      errors: [],
    });
  };

  if (state.sidebarCollapsed) {
    return (
      <div className="flex w-12 shrink-0 flex-col items-center border-r border-zinc-200 bg-zinc-50 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <Button
          variant="ghost"
          className="h-9 w-9 px-0"
          onClick={() => dispatch({ type: "sidebar-collapsed", collapsed: false })}
          aria-label="Expand sidebar"
        >
          <IconChevronRight />
        </Button>
      </div>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div>
          <h1 className="text-sm font-bold">Agent Blueprint</h1>
          <p className="text-xs text-zinc-500">Visual LangGraph editor</p>
        </div>
        <Button
          variant="ghost"
          className="h-9 w-9 px-0"
          onClick={() => dispatch({ type: "sidebar-collapsed", collapsed: true })}
          aria-label="Collapse sidebar"
        >
          <IconChevronLeft />
        </Button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <NodePalette />
        <Divider />
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Examples
          </p>
          {EXAMPLE_WORKFLOWS.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() =>
                dispatch({ type: "load-graph", graph: example.graph })
              }
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="font-medium">{example.name}</span>
              <p className="text-xs text-zinc-500">{example.description}</p>
            </button>
          ))}
        </section>
      </div>

      <footer className="space-y-2 border-t border-zinc-200 p-4 dark:border-zinc-800">
        {state.exportErrors.length > 0 && (
          <ul
            className={cn(
              "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800",
              "dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
            )}
          >
            {state.exportErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}
        <Button fullWidth onClick={handleExport}>
          Export Code
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={toggle}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => dispatch({ type: "clear" })}
          >
            <IconTrash />
          </Button>
        </div>
      </footer>
    </aside>
  );
}
