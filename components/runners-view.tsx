"use client";

import { useState } from "react";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Cpu,
  MemoryStick,
  Pause,
  Radio,
  RotateCw,
  Search,
  Server,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmptyState,
  ExportButton,
  PageHeading,
} from "@/components/dashboard-ui";
import { runnerStatusLabels } from "@/lib/labels";
import { runners, type Runner, type RunnerStatus } from "@/lib/mock-data";

export function RunnersView() {
  const [status, setStatus] = useState<RunnerStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [restarting, setRestarting] = useState<Runner | null>(null);
  const [selected, setSelected] = useState<Runner | null>(null);
  const filtered = runners.filter(
    (runner) =>
      (status === "all" || runner.status === status) &&
      `${runner.name} ${runner.id} ${runner.executor} ${runner.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * 6, currentPage * 6 + 6);
  const statuses = [
    { key: "all", label: "전체 러너", Icon: Server, color: "violet" },
    { key: "online", label: "온라인", Icon: Radio, color: "green" },
    { key: "offline", label: "오프라인", Icon: WifiOff, color: "amber" },
    { key: "paused", label: "일시중지", Icon: Pause, color: "gray" },
  ] as const;
  return (
    <>
      <PageHeading
        eyebrow="내 러너 현황"
        title="다음 빌드를 위한 준비."
        description="안정적인 러너가 좋은 아이디어를 이어갑니다. 상태를 한눈에 살펴보세요."
      >
        <ExportButton
          filename="infradash-runners"
          rows={[
            [
              "러너",
              "ID",
              "상태",
              "Executor",
              "CPU 사용률(%)",
              "메모리 사용률(%)",
              "실행 중인 작업",
            ],
            ...filtered.map((runner) => [
              runner.name,
              runner.id,
              runnerStatusLabels[runner.status],
              runner.executor,
              runner.cpu,
              runner.memory,
              runner.jobs,
            ]),
          ]}
        />
      </PageHeading>
      <div className="fleet-summary">
        {statuses.map((item) => (
          <button
            key={item.key}
            className={`fleet-summary-card ${status === item.key ? "active" : ""}`}
            aria-pressed={status === item.key}
            onClick={() => {
              setStatus(item.key);
              setPage(0);
            }}
          >
            <span className={`attention-icon ${item.color}`}>
              <item.Icon size={19} />
            </span>
            <div>
              <span>{item.label}</span>
              <strong>
                {item.key === "all"
                  ? runners.length
                  : runners.filter((runner) => runner.status === item.key)
                      .length}
              </strong>
            </div>
            <span className="filter-check" />
          </button>
        ))}
      </div>
      <div className="fleet-toolbar">
        <div>
          <h2>러너 목록</h2>
          <span>예시 러너 {filtered.length}대</span>
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            aria-label="러너 검색"
            placeholder="이름, 태그, Executor로 검색..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
      </div>
      {filtered.length ? (
        <>
          <div className="runner-grid">
            {visible.map((runner) => (
              <article className="runner-card" key={runner.id}>
                <div className="runner-card-top">
                  <span className="runner-server-icon">
                    <Server size={20} />
                  </span>
                  <span
                    className={`status-badge ${runner.status === "online" ? "green" : runner.status === "offline" ? "amber" : "gray"}`}
                  >
                    <span className="status-dot" />
                    {runnerStatusLabels[runner.status]}
                  </span>
                </div>
                <button
                  className="runner-title"
                  onClick={() => setSelected(runner)}
                >
                  {runner.name}
                </button>
                <div className="runner-subtitle">
                  <span>{runner.id}</span>
                  <span>·</span>
                  <Box size={13} />
                  <span>{runner.executor}</span>
                </div>
                <div className="runner-tags">
                  {runner.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="runner-resources">
                  {[
                    { label: "CPU", value: runner.cpu, Icon: Cpu },
                    {
                      label: "메모리",
                      value: runner.memory,
                      Icon: MemoryStick,
                    },
                  ].map((resource) => (
                    <div key={resource.label}>
                      <div>
                        <span>
                          <resource.Icon size={13} />
                          {resource.label}
                        </span>
                        <strong>
                          {runner.status === "online"
                            ? `${resource.value}%`
                            : "—"}
                        </strong>
                      </div>
                      <div className="resource-track">
                        <span style={{ width: `${resource.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="runner-card-bottom">
                  <span>
                    {runner.status === "online"
                      ? `실행 중인 작업 ${runner.jobs}개`
                      : runner.lastSeen}
                  </span>
                  <Button
                    variant="outline"
                    className="restart-button"
                    aria-label={`${runner.name} 재시작`}
                    onClick={() => setRestarting(runner)}
                  >
                    <RotateCw size={13} />
                    재시작
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <div className="fleet-pagination table-pagination">
            <span>
              총 {filtered.length}대 중 {currentPage * 6 + 1}–
              {Math.min((currentPage + 1) * 6, filtered.length)}대
            </span>
            <div>
              <Button
                variant="outline"
                size="icon"
                aria-label="이전 러너 페이지"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span>
                {currentPage + 1} / {pageCount} 페이지
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="다음 러너 페이지"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="panel">
          <EmptyState
            title="검색된 러너가 없어요"
            description="다른 이름, 태그, 상태로 검색해 보세요."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setPage(0);
                }}
              >
                필터 초기화
              </Button>
            }
          />
        </div>
      )}
      <div className="info-strip">
        <RotateCw size={18} />
        <div>
          <strong>부담 없이 기능을 살펴보세요.</strong>
          <span>
            재시작은 시뮬레이션으로 동작하며, 실제 인프라에 연결하지 않습니다.
          </span>
        </div>
      </div>
      <AlertDialog
        open={!!restarting}
        onOpenChange={(open) => {
          if (!open) setRestarting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <span className="dialog-icon">
              <RotateCw size={22} />
            </span>
            <AlertDialogTitle>러너 재시작을 체험할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              대상 러너: <strong>{restarting?.name}</strong> · 확인 후 안내
              메시지만 표시합니다. 실제 러너를 재시작하거나 요청을 보내지
              않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const name = restarting?.name;
                setRestarting(null);
                toast.success("재시작 시뮬레이션을 완료했어요", {
                  description: `${name}의 상태는 그대로예요. 실제 인프라 작업은 수행하지 않았습니다.`,
                });
              }}
            >
              재시작 체험하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="detail-dialog">
          <DialogHeader>
            <DialogTitle>{selected?.name ?? "러너 상세 정보"}</DialogTitle>
            <DialogDescription>
              예시 러너의 설정과 상태입니다.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <dl className="detail-list">
              <div>
                <dt>러너 ID</dt>
                <dd>{selected.id}</dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>{runnerStatusLabels[selected.status]}</dd>
              </div>
              <div>
                <dt>Executor</dt>
                <dd>{selected.executor}</dd>
              </div>
              <div>
                <dt>플랫폼</dt>
                <dd>{selected.platform}</dd>
              </div>
              <div>
                <dt>버전</dt>
                <dd>{selected.version}</dd>
              </div>
              <div>
                <dt>마지막 응답</dt>
                <dd>{selected.lastSeen}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
