export type AgentNodeType =
  | "start"
  | "llm"
  | "tool"
  | "condition"
  | "human"
  | "end";

export type ModelProvider = "openai" | "groq" | "claude";

export interface LlmNodeConfig {
  provider: ModelProvider;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface ToolNodeConfig {
  toolName: string;
  toolSchema: string;
}

export interface ConditionNodeConfig {
  conditionExpression: string;
}

export interface HumanNodeConfig {
  approvalMessage: string;
}

export type AgentNodeConfig =
  | Record<string, never>
  | LlmNodeConfig
  | ToolNodeConfig
  | ConditionNodeConfig
  | HumanNodeConfig;

export interface WorkflowNode {
  id: string;
  type: AgentNodeType;
  position: { x: number; y: number };
  config: AgentNodeConfig;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export function isLlmConfig(config: AgentNodeConfig): config is LlmNodeConfig {
  return "systemPrompt" in config;
}

export function isToolConfig(config: AgentNodeConfig): config is ToolNodeConfig {
  return "toolName" in config;
}

export function isConditionConfig(
  config: AgentNodeConfig
): config is ConditionNodeConfig {
  return "conditionExpression" in config;
}

export function isHumanConfig(config: AgentNodeConfig): config is HumanNodeConfig {
  return "approvalMessage" in config;
}
