"use client";

import type { ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  FlaskConical,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { metrics, workspace } from "@/lib/mock-data";

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-heading-actions">{children}</div>
    </div>
  );
}
export function PanelHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function ExportButton({
  rows,
  filename = "infradash-overview",
}: {
  rows: (string | number)[][];
  filename?: string;
}) {
  function download() {
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Your demo report is ready.", {
      description: "CSV exported from this workspace’s sample data.",
    });
  }
  return (
    <Button variant="outline" className="action-button" onClick={download}>
      <Download size={16} />
      Export report
    </Button>
  );
}
export function MetricCards() {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <article className="metric-card" key={metric.key}>
          <div className="metric-label">
            {metric.label}
            <span className="metric-indicator" />
          </div>
          <div className="metric-main">
            <div className="metric-value">
              {metric.value}
              <span>{metric.unit}</span>
            </div>
            <svg
              className={`sparkline ${metric.key === "runners" ? "muted" : ""}`}
              width="88"
              height="48"
              viewBox="0 0 88 48"
              role="img"
              aria-label={`${metric.label} sample trend`}
            >
              <path
                d={`M ${metric.points.map((point, index) => `${index * 8} ${48 - point * 0.7}`).join(" L ")}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="metric-caption">
            <span
              className={`metric-change ${metric.trend === "neutral" ? "neutral" : "positive"}`}
            >
              {metric.trend === "up" ? (
                <ArrowUpRight size={13} />
              ) : metric.trend === "down" ? (
                <ArrowDownLeft size={13} />
              ) : null}
              {metric.change}
            </span>
            <span>{metric.context}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
export function DemoFooter() {
  return (
    <footer className="demo-footer">
      <span>
        <FlaskConical size={14} />A little demo. A bigger picture.{" "}
        <span className="footer-extra">All workspace data is simulated.</span>
      </span>
      <span>Snapshot · {workspace.snapshot}</span>
    </footer>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-symbol">↗</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
