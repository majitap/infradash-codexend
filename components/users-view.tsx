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
import { memberStatusLabels } from "@/lib/labels";
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
        eyebrow="사용자 및 접근 권한"
        title="좋은 팀의 시작은, 사람."
        description="구성원은 편하게 협업하고, 접근 권한은 꼼꼼하게 관리하세요."
      >
        <ExportButton
          filename="infradash-users"
          rows={[
            ["이름", "이메일", "팀", "역할", "상태"],
            ...filtered.map((member) => [
              member.name,
              member.email,
              member.team,
              member.role,
              memberStatusLabels[member.status],
            ]),
          ]}
        />
      </PageHeading>
      <div className="people-stats">
        {[
          {
            label: "워크스페이스 구성원",
            value: workspace.totalUsers.toLocaleString("ko-KR"),
            text: `전체 ${workspace.seats.toLocaleString("ko-KR")}석 중`,
            Icon: Users,
            color: "violet",
          },
          {
            label: "이번 달 입사자",
            value: workspace.newUsers,
            text: "새로운 동료와 함께하는 시작",
            Icon: UserPlus,
            color: "green",
          },
          {
            label: "이번 달 퇴사자",
            value: workspace.departingUsers,
            text: "접근 권한 해제 완료",
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
          <div className="page-tabs" role="tablist" aria-label="구성원 구분">
            {(
              [
                { id: "all", label: "전체 구성원" },
                { id: "joiners", label: "입사자" },
                { id: "leavers", label: "퇴사자" },
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
          <span className="sample-label">예시 계정 목록</span>
        </div>
        <div id="members-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <div className="table-toolbar">
            <label className="search-field">
              <Search size={16} />
              <input
                aria-label="구성원 검색"
                placeholder="이름, 이메일, 팀으로 검색..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
              />
              {query && (
                <button aria-label="검색어 지우기" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              )}
            </label>
            <label className="select-label">
              역할
              <select
                aria-label="역할 필터"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setPage(0);
                }}
              >
                <option value="all">전체 역할</option>
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
              모든 예시 퇴사자의 접근 권한이 해제되었습니다.
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
                          구성원
                          {ascending ? (
                            <ArrowDown size={13} />
                          ) : (
                            <ArrowUp size={13} />
                          )}
                        </button>
                      </th>
                      <th scope="col">팀</th>
                      <th scope="col">역할</th>
                      <th scope="col">상태</th>
                      <th scope="col">
                        {tab === "all" ? "최근 활동" : "입퇴사 현황"}
                      </th>
                      <th scope="col">
                        <span className="sr-only">상세 정보</span>
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
                            {memberStatusLabels[member.status]}
                          </span>
                        </td>
                        <td className="activity-cell">{member.activity}</td>
                        <td>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`${member.name} 상세 보기`}
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
                  총 {filtered.length}명 중 {currentPage * 6 + 1}–
                  {Math.min((currentPage + 1) * 6, filtered.length)}명
                </span>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="이전 구성원 페이지"
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
                    aria-label="다음 구성원 페이지"
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
              title="검색된 구성원이 없어요"
              description="다른 이름이나 팀, 역할로 검색해 보세요."
              action={
                <Button variant="outline" onClick={reset}>
                  필터 초기화
                </Button>
              }
            />
          )}
        </div>
      </section>
      <div className="info-strip">
        <ShieldCheck size={18} />
        <div>
          <strong>꼼꼼한 권한 관리가, 안전한 협업으로.</strong>
          <span>
            구성원의 역할을 주기적으로 검토하고 퇴사자 권한 해제를 확인하세요.
          </span>
        </div>
        <span className="sample-label">데모 사용자 목록</span>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="detail-dialog">
          <DialogHeader>
            <DialogTitle>구성원 상세 정보</DialogTitle>
            <DialogDescription>
              {workspace.name}의 예시 구성원입니다.
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
                  <dt>팀</dt>
                  <dd>{selected.team}</dd>
                </div>
                <div>
                  <dt>역할</dt>
                  <dd>{selected.role}</dd>
                </div>
                <div>
                  <dt>계정 상태</dt>
                  <dd>{memberStatusLabels[selected.status]}</dd>
                </div>
                <div>
                  <dt>최근 활동</dt>
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
