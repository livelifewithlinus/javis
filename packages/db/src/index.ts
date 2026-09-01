import type { ActivityItem, Task } from "@jarvis/shared";

const tasks: Task[] = [
  { id: "task-1", title: "Review project documentation", status: "open", createdAt: new Date().toISOString() },
  { id: "task-2", title: "Analyze market trends", status: "open", createdAt: new Date().toISOString() },
];
const activity: ActivityItem[] = [];

export async function listTasks(): Promise<Task[]> { return tasks; }

export async function createTask(title: string): Promise<Task> {
  const task: Task = { id: crypto.randomUUID(), title, status: "open", createdAt: new Date().toISOString() };
  tasks.unshift(task);
  activity.unshift({ id: crypto.randomUUID(), type: "task", message: `Created task: ${title}`, createdAt: task.createdAt });
  return task;
}

export async function getActivity(): Promise<ActivityItem[]> { return activity; }

export async function decideApproval(id: string, decision: "approve" | "deny") {
  return { id, decision, status: decision === "approve" ? "approved" : "denied" };
}
