/** Fictional, deterministic demo data. No API clients, credentials, or live services. */
export const workspace = {
  name: "Orbit Engineering",
  shortName: "Orbit",
  environment: "Production",
  instance: "gitlab.orbit.example",
  region: "Seoul · ap-northeast-2",
  person: {
    name: "Min Ji",
    initials: "MJ",
    role: "Workspace admin",
    email: "minji@example.com",
  },
  snapshot: "Oct 31, 2026 · 09:00 KST",
  period: "Oct 2 – 31, 2026",
  uptime: "99.98%",
  totalUsers: 1284,
  activeUsers: 1196,
  seats: 1500,
  newUsers: 24,
  departingUsers: 3,
};

export const metrics = [
  {
    key: "users",
    label: "Active users",
    value: "1,196",
    unit: "",
    change: "+8.2%",
    context: "vs. previous 30 days",
    trend: "up",
    points: [18, 24, 20, 32, 28, 34, 30, 40, 38, 48, 44, 56],
  },
  {
    key: "runners",
    label: "Online runners",
    value: "12",
    unit: "/ 16",
    change: "75%",
    context: "of your runner fleet",
    trend: "neutral",
    points: [24, 24, 36, 36, 30, 42, 42, 36, 48, 48, 42, 42],
  },
  {
    key: "success",
    label: "Pipeline success",
    value: "97.6",
    unit: "%",
    change: "+1.4%",
    context: "vs. previous 30 days",
    trend: "up",
    points: [24, 32, 28, 40, 36, 44, 40, 48, 44, 52, 48, 56],
  },
  {
    key: "compute",
    label: "Compute minutes",
    value: "24,680",
    unit: "",
    change: "−6.3%",
    context: "less compute used",
    trend: "down",
    points: [56, 50, 54, 42, 46, 36, 40, 30, 36, 24, 28, 20],
  },
] as const;

export const pipelineActivity = [
  { date: "Oct 2", passed: 232, failed: 9 },
  { date: "Oct 3", passed: 280, failed: 12 },
  { date: "Oct 4", passed: 250, failed: 7 },
  { date: "Oct 5", passed: 188, failed: 8 },
  { date: "Oct 6", passed: 216, failed: 6 },
  { date: "Oct 7", passed: 318, failed: 11 },
  { date: "Oct 8", passed: 340, failed: 12 },
  { date: "Oct 9", passed: 292, failed: 8 },
  { date: "Oct 10", passed: 362, failed: 9 },
  { date: "Oct 11", passed: 320, failed: 8 },
  { date: "Oct 12", passed: 270, failed: 5 },
  { date: "Oct 13", passed: 294, failed: 10 },
  { date: "Oct 14", passed: 384, failed: 12 },
  { date: "Oct 15", passed: 428, failed: 9 },
  { date: "Oct 16", passed: 362, failed: 11 },
  { date: "Oct 17", passed: 400, failed: 8 },
  { date: "Oct 18", passed: 346, failed: 7 },
  { date: "Oct 19", passed: 298, failed: 6 },
  { date: "Oct 20", passed: 320, failed: 10 },
  { date: "Oct 21", passed: 432, failed: 9 },
  { date: "Oct 22", passed: 480, failed: 12 },
  { date: "Oct 23", passed: 448, failed: 8 },
  { date: "Oct 24", passed: 512, failed: 9 },
  { date: "Oct 25", passed: 456, failed: 7 },
  { date: "Oct 26", passed: 392, failed: 6 },
  { date: "Oct 27", passed: 432, failed: 9 },
  { date: "Oct 28", passed: 528, failed: 10 },
  { date: "Oct 29", passed: 492, failed: 8 },
  { date: "Oct 30", passed: 576, failed: 12 },
  { date: "Oct 31", passed: 548, failed: 9 },
];

export type Member = {
  id: string;
  name: string;
  initials: string;
  email: string;
  team: string;
  role: "Owner" | "Maintainer" | "Developer" | "Reporter";
  status: "Active" | "Invited" | "Deactivated";
  lifecycle: "member" | "joiner" | "leaver";
  activity: string;
  color: string;
};

export const members: Member[] = [
  {
    id: "u01",
    name: "Min Ji",
    initials: "MJ",
    email: "minji@example.com",
    team: "Platform",
    role: "Owner",
    status: "Active",
    lifecycle: "member",
    activity: "2 minutes ago",
    color: "violet",
  },
  {
    id: "u02",
    name: "Alex Morgan",
    initials: "AM",
    email: "alex.m@example.com",
    team: "Platform",
    role: "Maintainer",
    status: "Active",
    lifecycle: "member",
    activity: "8 minutes ago",
    color: "blue",
  },
  {
    id: "u03",
    name: "Sarah Kim",
    initials: "SK",
    email: "sarah.k@example.com",
    team: "Frontend",
    role: "Developer",
    status: "Active",
    lifecycle: "member",
    activity: "12 minutes ago",
    color: "rose",
  },
  {
    id: "u04",
    name: "Daniel Park",
    initials: "DP",
    email: "daniel.p@example.com",
    team: "Backend",
    role: "Developer",
    status: "Active",
    lifecycle: "member",
    activity: "24 minutes ago",
    color: "amber",
  },
  {
    id: "u05",
    name: "Jamie Chen",
    initials: "JC",
    email: "jamie.c@example.com",
    team: "Security",
    role: "Maintainer",
    status: "Active",
    lifecycle: "member",
    activity: "1 hour ago",
    color: "green",
  },
  {
    id: "u06",
    name: "Robin Lee",
    initials: "RL",
    email: "robin.l@example.com",
    team: "Design",
    role: "Reporter",
    status: "Active",
    lifecycle: "member",
    activity: "2 hours ago",
    color: "blue",
  },
  {
    id: "u07",
    name: "Taylor Wilson",
    initials: "TW",
    email: "taylor.w@example.com",
    team: "Backend",
    role: "Developer",
    status: "Active",
    lifecycle: "joiner",
    activity: "Joined Oct 28",
    color: "violet",
  },
  {
    id: "u08",
    name: "Yuna Choi",
    initials: "YC",
    email: "yuna.c@example.com",
    team: "Frontend",
    role: "Developer",
    status: "Invited",
    lifecycle: "joiner",
    activity: "Invited Oct 30",
    color: "rose",
  },
  {
    id: "u09",
    name: "Noah Davis",
    initials: "ND",
    email: "noah.d@example.com",
    team: "Platform",
    role: "Developer",
    status: "Active",
    lifecycle: "joiner",
    activity: "Joined Oct 24",
    color: "green",
  },
  {
    id: "u10",
    name: "Emma Brown",
    initials: "EB",
    email: "emma.b@example.com",
    team: "Backend",
    role: "Developer",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "Left Oct 25",
    color: "amber",
  },
  {
    id: "u11",
    name: "Chris Evans",
    initials: "CE",
    email: "chris.e@example.com",
    team: "Design",
    role: "Reporter",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "Left Oct 27",
    color: "blue",
  },
  {
    id: "u12",
    name: "Hana Seo",
    initials: "HS",
    email: "hana.s@example.com",
    team: "Security",
    role: "Maintainer",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "Left Oct 29",
    color: "violet",
  },
];

export type RunnerStatus = "online" | "offline" | "paused";
export type Runner = {
  id: string;
  name: string;
  status: RunnerStatus;
  executor: string;
  tags: string[];
  cpu: number;
  memory: number;
  jobs: number;
  lastSeen: string;
  version: string;
  platform: string;
};
export const runners: Runner[] = Array.from({ length: 16 }, (_, index) => ({
  id: `#${1041 + index}`,
  name: [
    "prod-docker-01",
    "prod-docker-02",
    "build-arm-01",
    "deploy-k8s-01",
    "staging-docker-01",
    "security-scan-01",
    "prod-docker-03",
    "build-arm-02",
    "test-linux-01",
    "test-linux-02",
    "deploy-k8s-02",
    "staging-docker-02",
    "legacy-shell-01",
    "build-windows-01",
    "sandbox-docker-01",
    "sandbox-docker-02",
  ][index],
  status: index < 12 ? "online" : index < 14 ? "offline" : "paused",
  executor:
    index === 12
      ? "Shell"
      : index === 3 || index === 10
        ? "Kubernetes"
        : "Docker",
  tags:
    index === 2 || index === 7
      ? ["arm64", "build"]
      : index === 5
        ? ["security", "scan"]
        : index > 13
          ? ["sandbox", "docker"]
          : [
              index < 4 || index === 6 || index === 10
                ? "production"
                : "staging",
              "linux",
            ],
  cpu: index < 12 ? [64, 48, 72, 32, 24, 56, 68, 40, 36, 48, 28, 52][index] : 0,
  memory:
    index < 12 ? [48, 32, 64, 24, 40, 48, 56, 32, 24, 40, 32, 48][index] : 0,
  jobs: index < 12 ? [3, 2, 4, 1, 0, 2, 3, 1, 2, 1, 0, 2][index] : 0,
  lastSeen:
    index < 12 ? "Just now" : index < 14 ? "2 hours ago" : "Paused by admin",
  version: "17.8.1",
  platform:
    index === 13
      ? "windows / amd64"
      : index === 2 || index === 7
        ? "linux / arm64"
        : "linux / amd64",
}));

export const attentionItems = [
  {
    kind: "runner",
    title: "2 runners need a check-in",
    description: "Offline runners haven’t reported in the last 2 hours.",
    label: "Review runners",
    href: "/runners/",
    severity: "amber",
  },
  {
    kind: "user",
    title: "3 departures, access removed",
    description: "All departing members have been deactivated.",
    label: "View leavers",
    href: "/users/?tab=leavers",
    severity: "green",
  },
  {
    kind: "upgrade",
    title: "Your next upgrade is taking shape",
    description: "Finish your preflight checks before the next step.",
    label: "Open checklist",
    href: "/upgrade/",
    severity: "violet",
  },
];

export const upgrade = {
  current: "17.8.1",
  target: "17.11.2",
  edition: "GitLab EE",
  maintenanceWindow: "Nov 7, 2026 · 02:00–04:00 KST",
  owner: "Platform team",
  estimatedDuration: "~ 2 hours",
  stops: [
    { version: "17.8.1", label: "Current version", status: "current" },
    { version: "17.8.7", label: "Patch stop", status: "required" },
    { version: "17.11.2", label: "Target version", status: "target" },
  ],
  phases: [
    {
      id: "preflight",
      name: "Preflight checks",
      description: "Make sure the foundation is ready.",
      items: [
        {
          id: "release-notes",
          label: "Review release notes and breaking changes",
          detail: "Document application and integration compatibility.",
          done: true,
        },
        {
          id: "disk-space",
          label: "Check available disk space",
          detail: "Confirm headroom for packages, backups, and migrations.",
          done: true,
        },
        {
          id: "migrations",
          label: "Confirm background migrations are complete",
          detail: "Review the migration status before each version stop.",
          done: false,
        },
      ],
    },
    {
      id: "backup",
      name: "Backup & recovery",
      description: "A little preparation goes a long way.",
      items: [
        {
          id: "backup-data",
          label: "Create a full application backup",
          detail: "Include repositories, database, uploads, and artifacts.",
          done: true,
        },
        {
          id: "backup-config",
          label: "Back up configuration and secrets securely",
          detail: "Record the secure backup location in your internal runbook.",
          done: true,
        },
        {
          id: "restore-test",
          label: "Verify a restore in staging",
          detail: "Confirm the recovery procedure with the platform team.",
          done: false,
        },
      ],
    },
    {
      id: "rollout",
      name: "Staged rollout",
      description: "Move forward, one version at a time.",
      items: [
        {
          id: "notify",
          label: "Schedule the maintenance window",
          detail: "Notify the team and pause scheduled pipelines.",
          done: true,
        },
        {
          id: "staging",
          label: "Rehearse the upgrade in staging",
          detail: "Capture timing and any follow-up actions.",
          done: true,
        },
        {
          id: "version-stops",
          label: "Complete each planned version stop",
          detail: "Check application health and migrations at every stop.",
          done: false,
        },
      ],
    },
    {
      id: "validate",
      name: "Post-upgrade validation",
      description: "Make sure everyone can get back to building.",
      items: [
        {
          id: "smoke-plan",
          label: "Prepare the smoke-test checklist",
          detail: "Cover sign-in, repository access, and pipeline execution.",
          done: true,
        },
        {
          id: "smoke-test",
          label: "Run application and runner smoke tests",
          detail: "Verify a test pipeline on every executor type.",
          done: false,
        },
        {
          id: "monitor",
          label: "Monitor errors and close the maintenance window",
          detail: "Observe the instance and share a completion update.",
          done: false,
        },
      ],
    },
  ],
};

export const initialCompleted = upgrade.phases.flatMap((phase) =>
  phase.items.filter((item) => item.done).map((item) => item.id),
);
export const upgradeTotal = upgrade.phases.reduce(
  (total, phase) => total + phase.items.length,
  0,
);

export const navigation = [
  {
    title: "Overview",
    url: "/",
    description: "Workspace health and pipeline activity",
  },
  {
    title: "Users",
    url: "/users/",
    description: "Members, joiners, and leavers",
  },
  {
    title: "Runners",
    url: "/runners/",
    description: "Fleet health and runner capacity",
  },
  {
    title: "Upgrade",
    url: "/upgrade/",
    description: "Your next GitLab upgrade plan",
  },
];
