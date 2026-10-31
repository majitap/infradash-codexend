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
      `Infradash — sample upgrade plan`,
      `${upgrade.current} → ${upgrade.target}`,
      `Window: ${upgrade.maintenanceWindow}`,
      "Illustrative demo only. This is not a verified GitLab upgrade path.",
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
    toast.success("Your sample upgrade plan is ready.");
  }
  return (
    <>
      <PageHeading
        eyebrow="A THOUGHTFUL NEXT STEP"
        title="Move forward. With a plan."
        description="Turn your next GitLab upgrade into a series of small, clear steps."
      >
        <Button
          variant="outline"
          className="action-button"
          onClick={exportPlan}
        >
          <Download size={16} />
          Export plan
        </Button>
      </PageHeading>
      <section className="upgrade-hero">
        <div>
          <span className="eyebrow">
            <Layers3 size={14} />
            YOUR UPGRADE JOURNEY
          </span>
          <h2>
            A newer version.
            <br /> The same peace of mind.
          </h2>
          <p>A sample plan for a well-prepared platform team.</p>
          <span className="sample-plan-badge">
            <FlaskConical size={13} />
            Illustrative demo path
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
                    "Planned patch stop"
                  ) : (
                    "Your destination"
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
            title="The little things that add up"
            description="Work through your plan, one check at a time."
          >
            <span className="count-badge">
              {completed.length} / {upgradeTotal}
            </span>
          </PanelHeading>
          <div className="checklist-progress">
            <div>
              <span>
                {percent === 100
                  ? "All checks complete. Nicely done."
                  : "Your preparation is taking shape."}
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
            <PanelHeading title="The plan, at a glance" />
            <dl>
              <div>
                <CalendarDays size={17} />
                <dt>Maintenance window</dt>
                <dd>{upgrade.maintenanceWindow}</dd>
              </div>
              <div>
                <Clock3 size={17} />
                <dt>Estimated duration</dt>
                <dd>{upgrade.estimatedDuration}</dd>
              </div>
              <div>
                <Users size={17} />
                <dt>Plan owner</dt>
                <dd>{upgrade.owner}</dd>
              </div>
              <div>
                <ShieldCheck size={17} />
                <dt>Environment</dt>
                <dd>Demo workspace</dd>
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
                ? "All set. Well prepared."
                : "Progress worth keeping."}
            </h3>
            <p>
              Your checklist is saved in this browser. Pick up right where you
              left off.
            </p>
            <div>
              <CheckCheck size={16} />
              <strong>
                {completed.length} of {upgradeTotal} checks complete
              </strong>
            </div>
            <Button variant="ghost" className="reset-checklist" onClick={reset}>
              <RotateCcw size={14} />
              Reset demo checklist
            </Button>
          </section>
          <div className="upgrade-demo-note">
            <FlaskConical size={16} />
            <p>
              This is a planning demo. Version stops are illustrative and do not
              define a verified GitLab upgrade path.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
