import type { AgentRequest, AgentResponse } from "@jarvis/shared";
import { createMemory } from "@jarvis/memory";
import { requiresApproval } from "@jarvis/policy";

export async function runAgent(request: AgentRequest): Promise<AgentResponse> {
  const message = request.message.trim();
  if (!message) return { text: "Please give me something to work on." };

  const approvalRequired = requiresApproval(message);
  if (/remember that|remember:/i.test(message)) {
    const content = message.replace(/^.*?remember(?: that|:)?\s*/i, "").trim();
    if (content) await createMemory(content);
  }

  if (approvalRequired) {
    return { text: "I can prepare that action, but it requires your approval before execution.", approvalRequired: true };
  }

  return { text: `Understood. I received: “${message}”` };
}
