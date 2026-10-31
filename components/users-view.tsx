"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  UserMinus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { members, workspace, type Member } from "@/lib/mock-data";

type Tab = "all" | "joiners" | "leavers";
function getTab(): Tab {
  const value = new URLSearchParams(window.location.search).get("tab");
  return value === "joiners" || value === "leavers" ? value : "all";
}
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function UsersView() {
  const tab = useSyncExternalStore(subscribe, getTab, () => "all" as Tab);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(0);
  const [ascending, setAscending] = useState(true);
  const [selected, setSelected] = useState<Member | null>(null);
  const filtered = members
    .filter(
      (member) =>
        (tab === "all" ||
          member.lifecycle === (tab === "joiners" ? "joiner" : "leaver")) &&
        (role === "all" || member.role === role) &&
        `${member.name} ${member.email} ${member.team}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * 6, currentPage * 6 + 6);
  const reset = () => {
    setQuery("");
    setRole("all");
    setPage(0);
  };
  function changeTab(value: Tab) {
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("tab");
    else url.searchParams.set("tab", value);
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    reset();
  }
  return (
    <>
      <PageHeading
        eyebrow="PEOPLE & ACCESS"
        title="Good teams start with people."
        description="Keep your workspace welcoming. Keep your access intentional."
      >
        <ExportButton
          filename="infradash-users"
          rows={[
            ["Name", "Email", "Team", "Role", "Status"],
            ...filtered.map((member) => [
              member.name,
              member.email,
              member.team,
              member.role,
              member.status,
            ]),
          ]}
        />
      </PageHeading>
      <div className="people-stats">
        {[
          {
            label: "Workspace members",
            value: workspace.totalUsers.toLocaleString("en-US"),
            text: `of ${workspace.seats.toLocaleString("en-US")} available seats`,
            Icon: Users,
            color: "violet",
          },
          {
            label: "Joined this month",
            value: workspace.newUsers,
            text: "A little more collective possibility",
            Icon: UserPlus,
            color: "green",
          },
          {
            label: "Departed this month",
            value: workspace.departingUsers,
            text: "All departing access removed",
            Icon: UserMinus,
            color: "amber",
          },
        ].map((stat) => (
          <article className="people-stat" key={stat.label}>
            <span className={`attention-icon ${stat.color}`}>
              <stat.Icon size={20} />
            </span>
            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.text}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="panel users-panel">
        <div className="table-top">
          <div
            className="page-tabs"
            role="tablist"
            aria-label="Member lifecycle"
          >
            {(
              [
                { id: "all", label: "All members" },
                { id: "joiners", label: "Joiners" },
                { id: "leavers", label: "Leavers" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                role="tab"
                aria-selected={tab === item.id}
                aria-controls="members-panel"
                onClick={() => changeTab(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const ids: Tab[] = ["all", "joiners", "leavers"];
                    const next =
                      ids[
                        (ids.indexOf(tab) +
                          (event.key === "ArrowRight" ? 1 : 2)) %
                          3
                      ];
                    changeTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
                tabIndex={tab === item.id ? 0 : -1}
              >
                {item.label}
                <span>
                  {
                    members.filter(
                      (member) =>
                        item.id === "all" ||
                        member.lifecycle ===
                          (item.id === "joiners" ? "joiner" : "leaver"),
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <span className="sample-label">Showing sample accounts</span>
        </div>
        <div id="members-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <div className="table-toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                aria-label="Search members"
                placeholder="Search by name, email, or team..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              )}
            </label>
            <label className="select-label">
              Role
              <select
                aria-label="Filter by role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setPage(0);
                }}
              >
                <option value="all">All roles</option>
                {["Owner", "Maintainer", "Developer", "Reporter"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
          </div>
          {tab === "leavers" && (
            <div className="table-notice">
              <ShieldCheck size={16} />
              Access has been removed for all departing sample members.
            </div>
          )}
          {filtered.length ? (
            <>
              <div className="table-scroll">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        aria-sort={ascending ? "ascending" : "descending"}
                      >
                        <button onClick={() => setAscending((value) => !value)}>
                          Member
                          {ascending ? (
                            <ArrowDown size={13} />
                          ) : (
                            <ArrowUp size={13} />
                          )}
                        </button>
                      </th>
                      <th scope="col">Team</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col">
                        {tab === "all" ? "Activity" : "Lifecycle"}
                      </th>
                      <th scope="col">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-cell">
                            <span className={`avatar avatar-${member.color}`}>
                              {member.initials}
                            </span>
                            <span>
                              <strong>{member.name}</strong>
                              <span>{member.email}</span>
                            </span>
                          </div>
                        </td>
                        <td>{member.team}</td>
                        <td>
                          <span className="role-badge">{member.role}</span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${member.status === "Active" ? "green" : member.status === "Invited" ? "violet" : "gray"}`}
                          >
                            <span className="status-dot" />
                            {member.status}
                          </span>
                        </td>
                        <td className="activity-cell">{member.activity}</td>
                        <td>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`View ${member.name}`}
                            onClick={() => setSelected(member)}
                          >
                            <ArrowUpRight size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-pagination">
                <span>
                  {currentPage * 6 + 1}–
                  {Math.min((currentPage + 1) * 6, filtered.length)} of{" "}
                  {filtered.length} sample members
                </span>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Previous members"
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
                    aria-label="Next members"
                    disabled={currentPage >= pageCount - 1}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No members found"
              description="Try a different name, team, or role."
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </section>
      <div className="info-strip">
        <ShieldCheck size={18} />
        <div>
          <strong>Thoughtful access. A stronger workspace.</strong>
          <span>
            Regularly review member roles and keep offboarding on your radar.
          </span>
        </div>
        <span className="sample-label">Demo directory</span>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="detail-dialog">
          <DialogHeader>
            <DialogTitle>Member details</DialogTitle>
            <DialogDescription>
              A sample member of {workspace.name}.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="profile-summary">
                <span className={`avatar avatar-${selected.color}`}>
                  {selected.initials}
                </span>
                <div>
                  <strong>{selected.name}</strong>
                  <p>{selected.email}</p>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Team</dt>
                  <dd>{selected.team}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{selected.role}</dd>
                </div>
                <div>
                  <dt>Account status</dt>
                  <dd>{selected.status}</dd>
                </div>
                <div>
                  <dt>Latest activity</dt>
                  <dd>{selected.activity}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
