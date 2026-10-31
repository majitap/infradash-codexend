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
        eyebrow="YOUR CONTROL ROOM"
        title="Infrastructure, at a glance."
        description="A clearer view of your GitLab. More room to build."
      >
        <span className="date-label">
          <Clock3 size={15} />
          {workspace.period}
        </span>
        <ExportButton
          rows={[
            ["Metric", "Value", "Comparison"],
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
          <strong>Your GitLab instance is healthy</strong>
          <span className="health-detail">
            All core services are operational.
          </span>
        </div>
        <span>
          <span className="status-dot green" />
          {workspace.uptime} uptime{" "}
          <span className="health-period">/ 30 days</span>
        </span>
      </div>
      <MetricCards />
      <div className="overview-main-grid">
        <section className="panel activity-panel">
          <PanelHeading
            title="Pipeline activity"
            description="Small commits. Steady momentum."
          >
            <div className="segmented" aria-label="Pipeline chart date range">
              {([7, 30] as const).map((value) => (
                <button
                  key={value}
                  aria-pressed={range === value}
                  className={range === value ? "selected" : ""}
                  onClick={() => setRange(value)}
                >
                  {value} days
                </button>
              ))}
            </div>
          </PanelHeading>
          <div className="chart-summary">
            <span className="chart-total">
              {(passed + failed).toLocaleString("en-US")}
            </span>
            <span>pipelines in {range} days</span>
            <div className="chart-legend">
              <span>
                <i className="legend-dot violet" />
                Passed
              </span>
              <span>
                <i className="legend-dot amber" />
                Failed
              </span>
            </div>
          </div>
          <div
            className="pipeline-chart"
            role="img"
            aria-label={`${range}-day pipeline activity: ${passed} passed and ${failed} failed`}
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
                  name="Passed"
                  stroke="#8a76d6"
                  strokeWidth={2.5}
                  fill="url(#pipeline-fill)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  name="Failed"
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
              Every pipeline is a step forward.
            </span>
            <span>Sample data · {range} days</span>
          </div>
        </section>
        <section className="panel capacity-panel">
          <PanelHeading
            title="Runner fleet"
            description="Ready when your team is."
          />
          <Link
            href="/runners/"
            className="capacity-visual"
            aria-label="View all 16 runners, 12 online"
          >
            <svg
              viewBox="0 0 216 184"
              role="img"
              aria-label="75 percent of runners online"
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
              <span>runners online</span>
              <span className="capacity-health">
                <span className="status-dot green" />
                Looking good
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
                <span>{status}</span>
              </div>
            ))}
          </div>
          <Link href="/runners/" className="panel-footer-link">
            Manage runners
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="overview-bottom-grid">
        <section className="panel attention-panel">
          <PanelHeading
            title="Worth a look"
            description="The right things, on your radar."
          >
            <span className="count-badge">{attentionItems.length} updates</span>
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
            <span className="count-badge">UP NEXT</span>
          </div>
          <h2>
            A little prep.
            <br /> A smoother upgrade.
          </h2>
          <p>Your next version is within reach.</p>
          <div className="version-preview">
            <span>{upgrade.current}</span>
            <ArrowRight size={16} />
            <strong>{upgrade.target}</strong>
          </div>
          <div className="upgrade-progress-label">
            <span>
              <CheckCheck size={14} />
              {completed.length} of {upgradeTotal} checks complete
            </span>
            <strong>{percent}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
          <Link href="/upgrade/" className="upgrade-preview-link">
            Continue your upgrade plan
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="overview-footnote">
        <ShieldCheck size={15} />
        <span>
          Built for peace of mind. This workspace uses fictional data only.
        </span>
      </div>
    </>
  );
}
