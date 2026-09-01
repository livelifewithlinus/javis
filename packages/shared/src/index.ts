export type Role = "user" | "assistant" | "system";

export interface AgentRequest {
  message: string;
  userId?: string;
  workspaceId?: string;
}

export interface AgentResponse {
  text: string;
  approvalRequired?: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: "open" | "completed";
  createdAt: string;
}

export interface Memory {
  id: string;
  content: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
