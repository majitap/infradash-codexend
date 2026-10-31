"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  CircleCheck,
  ClipboardCheck,
  Clock3,
  Download,
  FlaskConical,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeading, PanelHeading } from "@/components/dashboard-ui";
import { useUpgradeProgress } from "@/hooks/use-upgrade-progress";
import { upgrade, upgradeTotal } from "@/lib/mock-data";

export function UpgradeView() {
  const { completed, percent, toggle, reset } = useUpgradeProgress();
  function exportPlan() {
    const text = [
      "Infradash — 데모 업그레이드 계획",
      `${upgrade.current} → ${upgrade.target}`,
      `점검 시간: ${upgrade.maintenanceWindow}`,
      "데모용 예시이며, 검증된 GitLab 업그레이드 경로가 아닙니다.",
      "",
      ...upgrade.phases.flatMap((phase) => [
        phase.name,
        ...phase.items.map(
          (item) =>
            `[${completed.includes(item.id) ? "x" : " "}] ${item.label}`,
        ),
        "",
      ]),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "infradash-upgrade-plan.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("데모 업그레이드 계획을 내보냈어요.");
  }
  return (
    <>
      <PageHeading
        eyebrow="차분하게 준비하는 다음 단계"
        title="계획과 함께, 다음 버전으로."
        description="GitLab 업그레이드에 필요한 준비를 단계별로 정리했어요."
      >
        <Button
          variant="outline"
          className="action-button"
          onClick={exportPlan}
        >
          <Download size={16} />
          계획 내보내기
        </Button>
      </PageHeading>
      <section className="upgrade-hero">
        <div>
          <span className="eyebrow">
            <Layers3 size={14} />
            업그레이드 경로
          </span>
          <h2>
            더 새로운 버전으로,
            <br /> 안정적인 운영은 그대로.
          </h2>
          <p>플랫폼 팀을 위한 업그레이드 계획 예시입니다.</p>
          <span className="sample-plan-badge">
            <FlaskConical size={13} />
            데모용 예시 경로
          </span>
        </div>
        <div className="version-route">
          {upgrade.stops.map((stop, index) => (
            <div className="version-stop-wrap" key={stop.version}>
              {index > 0 && <ArrowRight className="version-arrow" size={24} />}
              <div className={`version-stop ${stop.status}`}>
                <span>{stop.label}</span>
                <strong>{stop.version}</strong>
                <span>
                  {index === 0 ? (
                    <>
                      <span className="status-dot green" />
                      {upgrade.edition}
                    </>
                  ) : index === 1 ? (
                    "중간 패치 적용"
                  ) : (
                    "업그레이드 목표"
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="upgrade-layout">
        <section className="panel checklist-panel">
          <PanelHeading
            title="하나씩 확인하는 준비 사항"
            description="체크리스트를 따라 차근차근 준비하세요."
          >
            <span className="count-badge">
              {completed.length} / {upgradeTotal}
            </span>
          </PanelHeading>
          <div className="checklist-progress">
            <div>
              <span>
                {percent === 100
                  ? "모든 점검을 마쳤어요. 준비가 끝났습니다."
                  : "업그레이드를 차근차근 준비하고 있어요."}
              </span>
              <strong>{percent}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="checklist-phases">
            {upgrade.phases.map((phase, index) => {
              const done = phase.items.filter((item) =>
                completed.includes(item.id),
              ).length;
              return (
                <section className="checklist-phase" key={phase.id}>
                  <div className="phase-heading">
                    <span
                      className={`phase-number ${done === phase.items.length ? "complete" : ""}`}
                    >
                      {done === phase.items.length ? (
                        <Check size={16} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h3>{phase.name}</h3>
                      <p>{phase.description}</p>
                    </div>
                    <span>
                      {done}/{phase.items.length}
                    </span>
                  </div>
                  <div className="phase-items">
                    {phase.items.map((item) => (
                      <label
                        className={`checklist-item ${completed.includes(item.id) ? "checked" : ""}`}
                        key={item.id}
                      >
                        <input
                          type="checkbox"
                          checked={completed.includes(item.id)}
                          onChange={() => toggle(item.id)}
                        />
                        <span className="custom-check">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>
                          <strong>{item.label}</strong>
                          <span>{item.detail}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
        <aside className="upgrade-side">
          <section className="panel plan-details">
            <PanelHeading title="업그레이드 계획 요약" />
            <dl>
              <div>
                <CalendarDays size={17} />
                <dt>예정된 점검 시간</dt>
                <dd>{upgrade.maintenanceWindow}</dd>
              </div>
              <div>
                <Clock3 size={17} />
                <dt>예상 소요 시간</dt>
                <dd>{upgrade.estimatedDuration}</dd>
              </div>
              <div>
                <Users size={17} />
                <dt>담당 팀</dt>
                <dd>{upgrade.owner}</dd>
              </div>
              <div>
                <ShieldCheck size={17} />
                <dt>환경</dt>
                <dd>데모 워크스페이스</dd>
              </div>
            </dl>
          </section>
          <section className="progress-summary">
            <span className="note-icon">
              {percent === 100 ? (
                <CircleCheck size={24} />
              ) : (
                <ClipboardCheck size={24} />
              )}
            </span>
            <h3>
              {percent === 100
                ? "모든 준비를 마쳤어요."
                : "준비한 내용은 저장해 둘게요."}
            </h3>
            <p>
              체크리스트는 이 브라우저에 저장돼요. 다음에도 이어서 준비할 수
              있어요.
            </p>
            <div>
              <CheckCheck size={16} />
              <strong>
                {upgradeTotal}개 중 {completed.length}개 완료
              </strong>
            </div>
            <Button variant="ghost" className="reset-checklist" onClick={reset}>
              <RotateCcw size={14} />
              데모 체크리스트 초기화
            </Button>
          </section>
          <div className="upgrade-demo-note">
            <FlaskConical size={16} />
            <p>
              업그레이드 준비를 위한 데모입니다. 표시된 중간 버전은 예시이며,
              검증된 GitLab 업그레이드 경로가 아닙니다.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
