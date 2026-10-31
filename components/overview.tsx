"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Clock3,
  GitBranch,
  Layers3,
  Server,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import {
  PageHeading,
  PanelHeading,
  ExportButton,
  MetricCards,
} from "@/components/dashboard-ui";
import {
  attentionItems,
  metrics,
  pipelineActivity,
  runners,
  upgrade,
  upgradeTotal,
  workspace,
} from "@/lib/mock-data";
import { runnerStatusLabels } from "@/lib/labels";
import { useUpgradeProgress } from "@/hooks/use-upgrade-progress";

export function Overview() {
  const [range, setRange] = useState<7 | 30>(30);
  const activity = pipelineActivity.slice(-range);
  const passed = activity.reduce((sum, point) => sum + point.passed, 0);
  const failed = activity.reduce((sum, point) => sum + point.failed, 0);
  const online = runners.filter((runner) => runner.status === "online").length;
  const { percent, completed } = useUpgradeProgress();
  return (
    <>
      <PageHeading
        eyebrow="내 인프라 현황"
        title="인프라 현황을 한눈에."
        description="GitLab 운영은 더 명확하게, 개발에 더 집중할 수 있도록."
      >
        <span className="date-label">
          <Clock3 size={15} />
          {workspace.period}
        </span>
        <ExportButton
          rows={[
            ["지표", "값", "비교"],
            ...metrics.map((metric) => [
              metric.label,
              metric.value + metric.unit,
              metric.change,
            ]),
          ]}
        />
      </PageHeading>
      <div className="health-banner">
        <div>
          <span className="health-icon">
            <Check size={14} strokeWidth={3} />
          </span>
          <strong>GitLab 인스턴스가 정상 작동 중이에요</strong>
          <span className="health-detail">모든 핵심 서비스가 정상입니다.</span>
        </div>
        <span>
          <span className="status-dot green" />
          {workspace.uptime} 가동률{" "}
          <span className="health-period">/ 30일</span>
        </span>
      </div>
      <MetricCards />
      <div className="overview-main-grid">
        <section className="panel activity-panel">
          <PanelHeading
            title="파이프라인 현황"
            description="작은 커밋이 모여, 꾸준한 변화를 만듭니다."
          >
            <div className="segmented" aria-label="파이프라인 조회 기간">
              {([7, 30] as const).map((value) => (
                <button
                  key={value}
                  aria-pressed={range === value}
                  className={range === value ? "selected" : ""}
                  onClick={() => setRange(value)}
                >
                  {value}일
                </button>
              ))}
            </div>
          </PanelHeading>
          <div className="chart-summary">
            <span className="chart-total">
              {(passed + failed).toLocaleString("ko-KR")}
            </span>
            <span>최근 {range}일 파이프라인</span>
            <div className="chart-legend">
              <span>
                <i className="legend-dot violet" />
                성공
              </span>
              <span>
                <i className="legend-dot amber" />
                실패
              </span>
            </div>
          </div>
          <div
            className="pipeline-chart"
            role="img"
            aria-label={`최근 ${range}일 파이프라인 현황: 성공 ${passed}건, 실패 ${failed}건`}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 720, height: 216 }}
            >
              <AreaChart
                data={activity}
                margin={{ top: 16, right: 8, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="pipeline-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8c79df" stopOpacity={0.24} />
                    <stop
                      offset="100%"
                      stopColor="#8c79df"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#eeedf3"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                  tick={{ fill: "#6b6376", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b6376", fontSize: 11 }}
                  tickCount={4}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e9e7f0",
                    boxShadow: "0 8px 32px #29233d10",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="passed"
                  name="성공"
                  stroke="#8a76d6"
                  strokeWidth={2.5}
                  fill="url(#pipeline-fill)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  name="실패"
                  stroke="#d5a05a"
                  strokeWidth={1.5}
                  fill="transparent"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-bottom">
            <span>
              <GitBranch size={14} />
              파이프라인과 함께 개발이 이어집니다.
            </span>
            <span>예시 데이터 · {range}일</span>
          </div>
        </section>
        <section className="panel capacity-panel">
          <PanelHeading
            title="러너 현황"
            description="팀의 다음 작업을 준비하고 있어요."
          />
          <Link
            href="/runners/"
            className="capacity-visual"
            aria-label="전체 러너 16대 보기, 12대 온라인"
          >
            <svg
              viewBox="0 0 216 184"
              role="img"
              aria-label="전체 러너의 75%가 온라인"
            >
              <circle
                cx="108"
                cy="100"
                r="72"
                fill="none"
                stroke="#efedf6"
                strokeWidth="16"
                strokeDasharray="339.3 452.4"
                transform="rotate(135 108 100)"
                strokeLinecap="round"
              />
              <circle
                cx="108"
                cy="100"
                r="72"
                fill="none"
                stroke="#8a76d6"
                strokeWidth="16"
                strokeDasharray={`${(339.3 * online) / runners.length} 452.4`}
                transform="rotate(135 108 100)"
                strokeLinecap="round"
              />
            </svg>
            <div className="capacity-number">
              <span>
                <strong>{online}</strong>
                <span>/ {runners.length}</span>
              </span>
              <span>온라인 러너</span>
              <span className="capacity-health">
                <span className="status-dot green" />
                정상 운영 중
              </span>
            </div>
          </Link>
          <div className="runner-legend">
            {(["online", "offline", "paused"] as const).map((status) => (
              <div key={status}>
                <span
                  className={`status-dot ${status === "online" ? "green" : status === "offline" ? "amber" : "gray"}`}
                />
                <strong>
                  {runners.filter((runner) => runner.status === status).length}
                </strong>
                <span>{runnerStatusLabels[status]}</span>
              </div>
            ))}
          </div>
          <Link href="/runners/" className="panel-footer-link">
            러너 관리
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="overview-bottom-grid">
        <section className="panel attention-panel">
          <PanelHeading
            title="확인하면 좋은 소식"
            description="지금 살펴볼 운영 소식을 모았어요."
          >
            <span className="count-badge">{attentionItems.length} 건</span>
          </PanelHeading>
          <div className="attention-list">
            {attentionItems.map((item) => {
              const Icon =
                item.kind === "runner"
                  ? Server
                  : item.kind === "user"
                    ? UserRoundCheck
                    : Layers3;
              return (
                <Link
                  key={item.kind}
                  href={item.href}
                  className="attention-row"
                >
                  <span className={`attention-icon ${item.severity}`}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="upgrade-preview">
          <div className="upgrade-preview-top">
            <span className="upgrade-icon">
              <Layers3 size={20} />
            </span>
            <span className="count-badge">다음 단계</span>
          </div>
          <h2>
            차근차근 준비하는,
            <br /> 안정적인 업그레이드.
          </h2>
          <p>다음 버전으로, 한 걸음 더 가까이.</p>
          <div className="version-preview">
            <span>{upgrade.current}</span>
            <ArrowRight size={16} />
            <strong>{upgrade.target}</strong>
          </div>
          <div className="upgrade-progress-label">
            <span>
              <CheckCheck size={14} />
              {upgradeTotal}개 중 {completed.length}개 완료
            </span>
            <strong>{percent}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
          <Link href="/upgrade/" className="upgrade-preview-link">
            업그레이드 준비 이어가기
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="overview-footnote">
        <ShieldCheck size={15} />
        <span>
          안심하고 둘러보세요. 이 워크스페이스는 가짜 데이터만 사용합니다.
        </span>
      </div>
    </>
  );
}
