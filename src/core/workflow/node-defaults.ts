import type { AgentNodeConfig, AgentNodeType } from "./types";

export const NODE_LABELS: Record<AgentNodeType, string> = {
  start: "Start",
  llm: "LLM Call",
  tool: "Tool Execution",
  condition: "Condition",
  human: "Human Approval",
  end: "End",
};

export function createDefaultConfig(type: AgentNodeType): AgentNodeConfig {
  switch (type) {
    case "llm":
      return {
        provider: "openai",
        systemPrompt: "You are a helpful AI assistant.",
        temperature: 0.7,
        maxTokens: 1024,
      };
    case "tool":
      return {
        toolName: "search_web",
        toolSchema: JSON.stringify(
          {
            name: "search_web",
            description: "Search the web",
            parameters: {},
          },
          null,
          2
        ),
      };
    case "condition":
      return { conditionExpression: "state.get('done', False)" };
    case "human":
      return {
        approvalMessage: "Please review and approve to continue.",
      };
    default:
      return {};
  }
}
