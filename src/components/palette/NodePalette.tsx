"use client";

import type { AgentNodeType } from "@/core/workflow";
import {
  IconDiamond,
  IconHand,
  IconPlay,
  IconSparkle,
  IconSquare,
  IconWrench,
} from "@/editor/icons";
import { NODE_LABELS, NODE_STYLES } from "@/editor/presentation/node-meta";
import { cn } from "@/core/style";

const ITEMS: { type: AgentNodeType; Icon: typeof IconPlay }[] = [
  { type: "start", Icon: IconPlay },
  { type: "llm", Icon: IconSparkle },
  { type: "tool", Icon: IconWrench },
  { type: "condition", Icon: IconDiamond },
  { type: "human", Icon: IconHand },
  { type: "end", Icon: IconSquare },
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: AgentNodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Node palette
      </p>
      <div className="flex flex-col gap-1.5">
        {ITEMS.map(({ type, Icon }) => {
          const style = NODE_STYLES[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className={cn(
                "flex cursor-grab items-center gap-2 rounded-md border px-3 py-2 text-sm active:cursor-grabbing",
                style.bg,
                style.border,
                style.text
              )}
            >
              <Icon />
              {NODE_LABELS[type]}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">Drag onto the canvas</p>
    </div>
  );
}
