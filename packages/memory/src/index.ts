import type { Memory } from "@jarvis/shared";

const memories: Memory[] = [];

export async function listMemories(): Promise<Memory[]> {
  return memories;
}

export async function createMemory(content: string): Promise<Memory> {
  const memory: Memory = { id: crypto.randomUUID(), content, createdAt: new Date().toISOString() };
  memories.unshift(memory);
  return memory;
}
