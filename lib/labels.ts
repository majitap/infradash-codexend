import type { Member, RunnerStatus } from "@/lib/mock-data";

// Keep machine values stable; translate the labels wherever they are displayed.
export const memberStatusLabels: Record<Member["status"], string> = {
  Active: "활성",
  Invited: "초대 중",
  Deactivated: "비활성",
};

export const runnerStatusLabels: Record<RunnerStatus, string> = {
  online: "온라인",
  offline: "오프라인",
  paused: "일시중지",
};
