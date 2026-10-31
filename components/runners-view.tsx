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
    { key: "all", label: "All runners", Icon: Server, color: "violet" },
    { key: "online", label: "Online", Icon: Radio, color: "green" },
    { key: "offline", label: "Offline", Icon: WifiOff, color: "amber" },
    { key: "paused", label: "Paused", Icon: Pause, color: "gray" },
  ] as const;
  return (
    <>
      <PageHeading
        eyebrow="YOUR RUNNER FLEET"
        title="Ready for the next build."
        description="A healthy fleet keeps good ideas moving. Keep yours in view."
      >
        <ExportButton
          filename="infradash-runners"
          rows={[
            ["Runner", "ID", "Status", "Executor", "CPU %", "Memory %", "Jobs"],
            ...filtered.map((runner) => [
              runner.name,
              runner.id,
              runner.status,
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
          <h2>Runner inventory</h2>
          <span>{filtered.length} sample runners</span>
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            aria-label="Search runners"
            placeholder="Search name, tag, or executor..."
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
                    {runner.status}
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
                      label: "Memory",
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
                      ? `${runner.jobs} active jobs`
                      : runner.lastSeen}
                  </span>
                  <Button
                    variant="outline"
                    className="restart-button"
                    aria-label={`Restart ${runner.name}`}
                    onClick={() => setRestarting(runner)}
                  >
                    <RotateCw size={13} />
                    Restart
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <div className="fleet-pagination table-pagination">
            <span>
              {currentPage * 6 + 1}–
              {Math.min((currentPage + 1) * 6, filtered.length)} of{" "}
              {filtered.length} runners
            </span>
            <div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous runners"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span>
                Page {currentPage + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next runners"
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
            title="No runners found"
            description="Try another name, tag, or status."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setPage(0);
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      )}
      <div className="info-strip">
        <RotateCw size={18} />
        <div>
          <strong>Try it with confidence.</strong>
          <span>
            Restart actions are simulated. Your real infrastructure is never
            connected.
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
            <AlertDialogTitle>Simulate a runner restart?</AlertDialogTitle>
            <AlertDialogDescription>
              Try a restart for <strong>{restarting?.name}</strong>. This demo
              only shows a confirmation toast. No runner is restarted and no
              request is sent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const name = restarting?.name;
                setRestarting(null);
                toast.success("Restart simulated", {
                  description: `${name} is unchanged. No infrastructure action was performed.`,
                });
              }}
            >
              Simulate restart
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
            <DialogTitle>{selected?.name ?? "Runner details"}</DialogTitle>
            <DialogDescription>
              Fictional runner configuration and status.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <dl className="detail-list">
              <div>
                <dt>Runner ID</dt>
                <dd>{selected.id}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selected.status}</dd>
              </div>
              <div>
                <dt>Executor</dt>
                <dd>{selected.executor}</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>{selected.platform}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{selected.version}</dd>
              </div>
              <div>
                <dt>Last seen</dt>
                <dd>{selected.lastSeen}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
