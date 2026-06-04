export function lines(...parts: string[]): string {
  return parts.filter((p) => p.length > 0).join("\n");
}

export function indent(block: string, spaces = 4): string {
  const pad = " ".repeat(spaces);
  return block
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

export function escapePythonString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

export function pythonId(nodeId: string, index: number): string {
  const safe = nodeId.replace(/[^a-zA-Z0-9]/g, "_");
  return `node_${index}_${safe}`;
}
