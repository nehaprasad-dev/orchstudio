import { createDefaultConfig } from "./node-defaults";
import type { WorkflowGraph } from "./types";

export interface ExampleWorkflow {
  id: string;
  name: string;
  description: string;
  graph: WorkflowGraph;
}

function node(
  id: string,
  type: WorkflowGraph["nodes"][number]["type"],
  x: number,
  y: number,
  config?: WorkflowGraph["nodes"][number]["config"]
) {
  return {
    id,
    type,
    position: { x, y },
    config: config ?? createDefaultConfig(type),
  };
}

function edge(
  id: string,
  source: string,
  target: string,
  label?: string
) {
  return { id, source, target, label };
}

export const EXAMPLE_WORKFLOWS: ExampleWorkflow[] = [
  {
    id: "simple-gpt",
    name: "Simple GPT Agent",
    description: "Start → LLM → End",
    graph: {
      nodes: [
        node("start-1", "start", 80, 200),
        node("llm-1", "llm", 320, 200),
        node("end-1", "end", 560, 200),
      ],
      edges: [
        edge("e1", "start-1", "llm-1"),
        edge("e2", "llm-1", "end-1"),
      ],
    },
  },
  {
    id: "react-agent",
    name: "ReAct Agent",
    description: "Reason, call tools, loop until done",
    graph: {
      nodes: [
        node("start-1", "start", 40, 220),
        node("llm-1", "llm", 240, 220, {
          ...createDefaultConfig("llm"),
          systemPrompt:
            "You are a ReAct agent. Reason step by step, then call tools when needed.",
        } as WorkflowGraph["nodes"][number]["config"]),
        node("tool-1", "tool", 460, 120),
        node("cond-1", "condition", 460, 320, {
          conditionExpression: "state.get('done', False)",
        }),
        node("end-1", "end", 700, 320),
      ],
      edges: [
        edge("e1", "start-1", "llm-1"),
        edge("e2", "llm-1", "tool-1", "use_tool"),
        edge("e3", "tool-1", "llm-1"),
        edge("e4", "llm-1", "cond-1"),
        edge("e5", "cond-1", "llm-1", "False"),
        edge("e6", "cond-1", "end-1", "True"),
      ],
    },
  },
  {
    id: "compliance",
    name: "Compliance Checker",
    description: "Human approval before sensitive actions",
    graph: {
      nodes: [
        node("start-1", "start", 40, 200),
        node("llm-1", "llm", 240, 200, {
          ...createDefaultConfig("llm"),
          systemPrompt: "Analyze the request for compliance risks.",
        } as WorkflowGraph["nodes"][number]["config"]),
        node("human-1", "human", 440, 200),
        node("tool-1", "tool", 640, 200, {
          toolName: "submit_action",
          toolSchema: '{"name":"submit_action","description":"Execute approved action"}',
        }),
        node("end-1", "end", 840, 200),
      ],
      edges: [
        edge("e1", "start-1", "llm-1"),
        edge("e2", "llm-1", "human-1"),
        edge("e3", "human-1", "tool-1"),
        edge("e4", "tool-1", "end-1"),
      ],
    },
  },
];
