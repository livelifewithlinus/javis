export type RiskLevel = "low" | "medium" | "high";

export function requiresApproval(action: string, risk: RiskLevel = "low"): boolean {
  return risk === "high" || /delete|transfer|send|purchase|deploy/i.test(action);
}
