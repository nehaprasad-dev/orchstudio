import { escapePythonString, indent, lines, pythonId } from "./emit";
import type { WorkflowNode } from "../workflow/types";
import {
  isConditionConfig,
  isHumanConfig,
  isLlmConfig,
  isToolConfig,
} from "../workflow/types";

function llmModel(provider: string): string {
  switch (provider) {
    case "groq":
      return "groq/llama-3.1-70b-versatile";
    case "claude":
      return "anthropic/claude-3-5-sonnet-20241022";
    default:
      return "gpt-4o-mini";
  }
}

export function buildNodeFunction(
  node: WorkflowNode,
  pyName: string
): string {
  const header = lines(
    `def ${pyName}(state: AgentState) -> AgentState:`,
    `    """${node.type} node (canvas id: ${node.id})."""`,
    ""
  );

  switch (node.type) {
    case "start":
      return header + indent("return state");
    case "end":
      return header + indent("return state");
    case "llm": {
      if (!isLlmConfig(node.config)) break;
      const c = node.config;
      return (
        header +
        indent(
          lines(
            `llm = ChatOpenAI(model="${llmModel(c.provider)}", temperature=${c.temperature}, max_tokens=${c.maxTokens})`,
            "messages = [",
            `    SystemMessage(content="${escapePythonString(c.systemPrompt)}"),`,
            '    HumanMessage(content=state.get("input", "")),',
            "]",
            "response = llm.invoke(messages)",
            'return {**state, "messages": state.get("messages", []) + [response]}',
          )
        )
      );
    }
    case "tool": {
      if (!isToolConfig(node.config)) break;
      return (
        header +
        indent(
          lines(
            `result = run_tool("${escapePythonString(node.config.toolName)}", state)`,
            'return {**state, "tool_result": result}',
          )
        )
      );
    }
    case "condition": {
      if (!isConditionConfig(node.config)) break;
      return (
        header +
        indent(
          lines(
            `# Routing for: ${node.config.conditionExpression}`,
            "return state",
          )
        )
      );
    }
    case "human": {
      if (!isHumanConfig(node.config)) break;
      return (
        header +
        indent(
          lines(
            `# ${node.config.approvalMessage}`,
            'return {**state, "awaiting_human": True}',
          )
        )
      );
    }
  }

  return header + indent("return state");
}

export function buildAllNodeFunctions(
  nodes: WorkflowNode[],
  idToPy: Map<string, string>
): string {
  return nodes
    .map((node, index) => {
      const pyName = idToPy.get(node.id) ?? pythonId(node.id, index);
      return buildNodeFunction(node, pyName);
    })
    .join("\n\n\n");
}
