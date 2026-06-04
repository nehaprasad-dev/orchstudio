"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";

import type { FlowNodeData } from "@/editor/adapters/react-flow";
import {
  IconDiamond,
  IconHand,
  IconPlay,
  IconSparkle,
  IconSquare,
  IconWrench,
} from "@/editor/icons";
import { NODE_LABELS, NODE_STYLES } from "@/editor/presentation/node-meta";
import type { AgentNodeType } from "@/core/workflow";
import { cn } from "@/core/style";

const ICONS: Record<AgentNodeType, typeof IconPlay> = {
  start: IconPlay,
  llm: IconSparkle,
  tool: IconWrench,
  condition: IconDiamond,
  human: IconHand,
  end: IconSquare,
};

function AgentNodeComponent({ data, selected }: NodeProps) {
  const { workflow } = data as FlowNodeData;
  const { type } = workflow;
  const style = NODE_STYLES[type];
  const Icon = ICONS[type];

  return (
    <div
      className={cn(
        "min-w-[160px] rounded-lg border-2 px-4 py-3 shadow-sm",
        style.bg,
        style.border,
        selected && "ring-2 ring-zinc-400 ring-offset-2 dark:ring-offset-zinc-900"
      )}
    >
      {type !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-zinc-400 !bg-white dark:!bg-zinc-800"
        />
      )}
      <div className={cn("flex items-center gap-2", style.text)}>
        <Icon />
        <span className="text-sm font-semibold">{NODE_LABELS[type]}</span>
      </div>
      {type === "condition" && (
        <p className="mt-1 text-xs opacity-70">Label branches True / False</p>
      )}
      {type !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-zinc-400 !bg-white dark:!bg-zinc-800"
        />
      )}
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
