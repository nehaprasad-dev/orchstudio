"use client";

import type {
  ConditionNodeConfig,
  HumanNodeConfig,
  LlmNodeConfig,
  ToolNodeConfig,
} from "@/core/workflow";
import {
  isConditionConfig,
  isHumanConfig,
  isLlmConfig,
  isToolConfig,
} from "@/core/workflow";
import { NODE_LABELS } from "@/editor/presentation/node-meta";
import { useWorkflowEditor } from "@/editor/store/workflow-context";
import {
  FieldLabel,
  SelectNative,
  SidePanel,
  TextArea,
  TextInput,
} from "@/ui/primitives";

export function NodeConfigSheet() {
  const { state, dispatch } = useWorkflowEditor();
  const node = state.flowNodes.find((n) => n.id === state.selectedNodeId);
  const workflow = node?.data.workflow;

  return (
    <SidePanel
      open={Boolean(workflow)}
      onClose={() => dispatch({ type: "select-node", id: null })}
      title={workflow ? `${NODE_LABELS[workflow.type]} settings` : "Node"}
    >
      {workflow?.type === "llm" && isLlmConfig(workflow.config) && (
        <LlmFields
          config={workflow.config}
          onChange={(config) =>
            dispatch({
              type: "update-config",
              nodeId: workflow.id,
              config,
            })
          }
        />
      )}
      {workflow?.type === "tool" && isToolConfig(workflow.config) && (
        <ToolFields
          config={workflow.config}
          onChange={(config) =>
            dispatch({
              type: "update-config",
              nodeId: workflow.id,
              config,
            })
          }
        />
      )}
      {workflow?.type === "condition" && isConditionConfig(workflow.config) && (
        <ConditionFields
          config={workflow.config}
          onChange={(config) =>
            dispatch({
              type: "update-config",
              nodeId: workflow.id,
              config,
            })
          }
        />
      )}
      {workflow?.type === "human" && isHumanConfig(workflow.config) && (
        <HumanFields
          config={workflow.config}
          onChange={(config) =>
            dispatch({
              type: "update-config",
              nodeId: workflow.id,
              config,
            })
          }
        />
      )}
      {workflow &&
        !["llm", "tool", "condition", "human"].includes(workflow.type) && (
          <p className="text-sm text-zinc-500">No settings for this node type.</p>
        )}
    </SidePanel>
  );
}

function LlmFields({
  config,
  onChange,
}: {
  config: LlmNodeConfig;
  onChange: (c: LlmNodeConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel>Provider</FieldLabel>
        <SelectNative
          value={config.provider}
          onChange={(e) =>
            onChange({
              ...config,
              provider: e.target.value as LlmNodeConfig["provider"],
            })
          }
        >
          <option value="openai">OpenAI</option>
          <option value="groq">Groq</option>
          <option value="claude">Claude</option>
        </SelectNative>
      </div>
      <div className="space-y-2">
        <FieldLabel>System prompt</FieldLabel>
        <TextArea
          rows={6}
          value={config.systemPrompt}
          onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel>Temperature</FieldLabel>
          <TextInput
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={config.temperature}
            onChange={(e) =>
              onChange({ ...config, temperature: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Max tokens</FieldLabel>
          <TextInput
            type="number"
            min={1}
            value={config.maxTokens}
            onChange={(e) =>
              onChange({ ...config, maxTokens: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}

function ToolFields({
  config,
  onChange,
}: {
  config: ToolNodeConfig;
  onChange: (c: ToolNodeConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel>Tool name</FieldLabel>
        <TextInput
          value={config.toolName}
          onChange={(e) => onChange({ ...config, toolName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <FieldLabel>Tool schema (JSON)</FieldLabel>
        <TextArea
          className="font-mono text-xs"
          rows={10}
          value={config.toolSchema}
          onChange={(e) => onChange({ ...config, toolSchema: e.target.value })}
        />
      </div>
    </div>
  );
}

function ConditionFields({
  config,
  onChange,
}: {
  config: ConditionNodeConfig;
  onChange: (c: ConditionNodeConfig) => void;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>Condition expression</FieldLabel>
      <TextArea
        className="font-mono text-xs"
        rows={4}
        value={config.conditionExpression}
        onChange={(e) =>
          onChange({ ...config, conditionExpression: e.target.value })
        }
      />
      <p className="text-xs text-zinc-500">
        Double-click outgoing edges to set branch labels.
      </p>
    </div>
  );
}

function HumanFields({
  config,
  onChange,
}: {
  config: HumanNodeConfig;
  onChange: (c: HumanNodeConfig) => void;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>Approval message</FieldLabel>
      <TextArea
        rows={4}
        value={config.approvalMessage}
        onChange={(e) => onChange({ ...config, approvalMessage: e.target.value })}
      />
    </div>
  );
}
