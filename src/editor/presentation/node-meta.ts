import type { AgentNodeType } from "@/core/workflow";
import { NODE_LABELS } from "@/core/workflow";

export { NODE_LABELS };

export const NODE_STYLES: Record<
  AgentNodeType,
  { bg: string; border: string; text: string }
> = {
  start: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  llm: {
    bg: "bg-blue-500/15",
    border: "border-blue-500",
    text: "text-blue-700 dark:text-blue-300",
  },
  tool: {
    bg: "bg-amber-500/15",
    border: "border-amber-500",
    text: "text-amber-800 dark:text-amber-300",
  },
  condition: {
    bg: "bg-red-500/15",
    border: "border-red-500",
    text: "text-red-700 dark:text-red-300",
  },
  human: {
    bg: "bg-violet-500/15",
    border: "border-violet-500",
    text: "text-violet-700 dark:text-violet-300",
  },
  end: {
    bg: "bg-zinc-500/15",
    border: "border-zinc-500",
    text: "text-zinc-700 dark:text-zinc-300",
  },
};
