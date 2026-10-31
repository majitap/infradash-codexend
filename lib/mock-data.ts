/** Fictional, deterministic demo data. No API clients, credentials, or live services. */
export const workspace = {
  name: "Orbit Engineering",
  shortName: "Orbit",
  environment: "프로덕션",
  instance: "gitlab.orbit.example",
  region: "서울 · ap-northeast-2",
  person: {
    name: "Min Ji",
    initials: "MJ",
    role: "워크스페이스 관리자",
    email: "minji@example.com",
  },
  snapshot: "2026. 10. 31. · 09:00 KST",
  period: "2026. 10. 2. – 10. 31.",
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
    label: "활성 사용자",
    value: "1,196",
    unit: "",
    change: "+8.2%",
    context: "이전 30일 대비",
    trend: "up",
    points: [18, 24, 20, 32, 28, 34, 30, 40, 38, 48, 44, 56],
  },
  {
    key: "runners",
    label: "온라인 러너",
    value: "12",
    unit: "/ 16",
    change: "75%",
    context: "전체 러너 중",
    trend: "neutral",
    points: [24, 24, 36, 36, 30, 42, 42, 36, 48, 48, 42, 42],
  },
  {
    key: "success",
    label: "파이프라인 성공률",
    value: "97.6",
    unit: "%",
    change: "+1.4%",
    context: "이전 30일 대비",
    trend: "up",
    points: [24, 32, 28, 40, 36, 44, 40, 48, 44, 52, 48, 56],
  },
  {
    key: "compute",
    label: "컴퓨팅 사용 시간(분)",
    value: "24,680",
    unit: "",
    change: "−6.3%",
    context: "컴퓨팅 사용량 감소",
    trend: "down",
    points: [56, 50, 54, 42, 46, 36, 40, 30, 36, 24, 28, 20],
  },
] as const;

export const pipelineActivity = [
  { date: "10월 2일", passed: 232, failed: 9 },
  { date: "10월 3일", passed: 280, failed: 12 },
  { date: "10월 4일", passed: 250, failed: 7 },
  { date: "10월 5일", passed: 188, failed: 8 },
  { date: "10월 6일", passed: 216, failed: 6 },
  { date: "10월 7일", passed: 318, failed: 11 },
  { date: "10월 8일", passed: 340, failed: 12 },
  { date: "10월 9일", passed: 292, failed: 8 },
  { date: "10월 10일", passed: 362, failed: 9 },
  { date: "10월 11일", passed: 320, failed: 8 },
  { date: "10월 12일", passed: 270, failed: 5 },
  { date: "10월 13일", passed: 294, failed: 10 },
  { date: "10월 14일", passed: 384, failed: 12 },
  { date: "10월 15일", passed: 428, failed: 9 },
  { date: "10월 16일", passed: 362, failed: 11 },
  { date: "10월 17일", passed: 400, failed: 8 },
  { date: "10월 18일", passed: 346, failed: 7 },
  { date: "10월 19일", passed: 298, failed: 6 },
  { date: "10월 20일", passed: 320, failed: 10 },
  { date: "10월 21일", passed: 432, failed: 9 },
  { date: "10월 22일", passed: 480, failed: 12 },
  { date: "10월 23일", passed: 448, failed: 8 },
  { date: "10월 24일", passed: 512, failed: 9 },
  { date: "10월 25일", passed: 456, failed: 7 },
  { date: "10월 26일", passed: 392, failed: 6 },
  { date: "10월 27일", passed: 432, failed: 9 },
  { date: "10월 28일", passed: 528, failed: 10 },
  { date: "10월 29일", passed: 492, failed: 8 },
  { date: "10월 30일", passed: 576, failed: 12 },
  { date: "10월 31일", passed: 548, failed: 9 },
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
    team: "플랫폼",
    role: "Owner",
    status: "Active",
    lifecycle: "member",
    activity: "2분 전",
    color: "violet",
  },
  {
    id: "u02",
    name: "Alex Morgan",
    initials: "AM",
    email: "alex.m@example.com",
    team: "플랫폼",
    role: "Maintainer",
    status: "Active",
    lifecycle: "member",
    activity: "8분 전",
    color: "blue",
  },
  {
    id: "u03",
    name: "Sarah Kim",
    initials: "SK",
    email: "sarah.k@example.com",
    team: "프론트엔드",
    role: "Developer",
    status: "Active",
    lifecycle: "member",
    activity: "12분 전",
    color: "rose",
  },
  {
    id: "u04",
    name: "Daniel Park",
    initials: "DP",
    email: "daniel.p@example.com",
    team: "백엔드",
    role: "Developer",
    status: "Active",
    lifecycle: "member",
    activity: "24분 전",
    color: "amber",
  },
  {
    id: "u05",
    name: "Jamie Chen",
    initials: "JC",
    email: "jamie.c@example.com",
    team: "보안",
    role: "Maintainer",
    status: "Active",
    lifecycle: "member",
    activity: "1시간 전",
    color: "green",
  },
  {
    id: "u06",
    name: "Robin Lee",
    initials: "RL",
    email: "robin.l@example.com",
    team: "디자인",
    role: "Reporter",
    status: "Active",
    lifecycle: "member",
    activity: "2시간 전",
    color: "blue",
  },
  {
    id: "u07",
    name: "Taylor Wilson",
    initials: "TW",
    email: "taylor.w@example.com",
    team: "백엔드",
    role: "Developer",
    status: "Active",
    lifecycle: "joiner",
    activity: "10월 28일 입사",
    color: "violet",
  },
  {
    id: "u08",
    name: "Yuna Choi",
    initials: "YC",
    email: "yuna.c@example.com",
    team: "프론트엔드",
    role: "Developer",
    status: "Invited",
    lifecycle: "joiner",
    activity: "10월 30일 초대",
    color: "rose",
  },
  {
    id: "u09",
    name: "Noah Davis",
    initials: "ND",
    email: "noah.d@example.com",
    team: "플랫폼",
    role: "Developer",
    status: "Active",
    lifecycle: "joiner",
    activity: "10월 24일 입사",
    color: "green",
  },
  {
    id: "u10",
    name: "Emma Brown",
    initials: "EB",
    email: "emma.b@example.com",
    team: "백엔드",
    role: "Developer",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "10월 25일 퇴사",
    color: "amber",
  },
  {
    id: "u11",
    name: "Chris Evans",
    initials: "CE",
    email: "chris.e@example.com",
    team: "디자인",
    role: "Reporter",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "10월 27일 퇴사",
    color: "blue",
  },
  {
    id: "u12",
    name: "Hana Seo",
    initials: "HS",
    email: "hana.s@example.com",
    team: "보안",
    role: "Maintainer",
    status: "Deactivated",
    lifecycle: "leaver",
    activity: "10월 29일 퇴사",
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
    index < 12 ? "방금 전" : index < 14 ? "2시간 전" : "관리자가 일시중지",
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
    title: "러너 2대의 상태를 확인해 주세요",
    description: "최근 2시간 동안 응답이 없는 러너가 있습니다.",
    label: "러너 확인",
    href: "/runners/",
    severity: "amber",
  },
  {
    kind: "user",
    title: "퇴사자 3명의 접근 권한을 해제했어요",
    description: "퇴사한 구성원의 계정을 모두 비활성화했습니다.",
    label: "퇴사자 보기",
    href: "/users/?tab=leavers",
    severity: "green",
  },
  {
    kind: "upgrade",
    title: "다음 업그레이드를 준비하고 있어요",
    description: "다음 단계에 앞서 사전 점검을 마무리해 주세요.",
    label: "체크리스트 열기",
    href: "/upgrade/",
    severity: "violet",
  },
];

export const upgrade = {
  current: "17.8.1",
  target: "17.11.2",
  edition: "GitLab EE",
  maintenanceWindow: "2026. 11. 7. · 02:00–04:00 KST",
  owner: "플랫폼 팀",
  estimatedDuration: "약 2시간",
  stops: [
    { version: "17.8.1", label: "현재 버전", status: "current" },
    { version: "17.8.7", label: "중간 패치 버전", status: "required" },
    { version: "17.11.2", label: "목표 버전", status: "target" },
  ],
  phases: [
    {
      id: "preflight",
      name: "사전 점검",
      description: "업그레이드를 시작할 준비가 되었는지 확인해요.",
      items: [
        {
          id: "release-notes",
          label: "릴리스 노트와 주요 변경 사항 검토",
          detail: "애플리케이션과 연동 서비스의 호환성을 확인하고 기록하세요.",
          done: true,
        },
        {
          id: "disk-space",
          label: "여유 디스크 공간 확인",
          detail: "패키지, 백업, 마이그레이션에 필요한 공간을 확보하세요.",
          done: true,
        },
        {
          id: "migrations",
          label: "백그라운드 마이그레이션 완료 확인",
          detail: "각 버전으로 이동하기 전에 마이그레이션 상태를 확인하세요.",
          done: false,
        },
      ],
    },
    {
      id: "backup",
      name: "백업 및 복구",
      description: "충분한 준비가 안정적인 복구로 이어져요.",
      items: [
        {
          id: "backup-data",
          label: "애플리케이션 전체 백업 생성",
          detail: "저장소, 데이터베이스, 업로드 파일, 아티팩트를 포함하세요.",
          done: true,
        },
        {
          id: "backup-config",
          label: "설정과 시크릿을 안전하게 백업",
          detail: "안전한 백업 위치를 내부 운영 문서에 기록하세요.",
          done: true,
        },
        {
          id: "restore-test",
          label: "스테이징 환경에서 복원 검증",
          detail: "플랫폼 팀과 함께 복구 절차를 확인하세요.",
          done: false,
        },
      ],
    },
    {
      id: "rollout",
      name: "단계별 업그레이드",
      description: "한 번에 한 버전씩 차근차근 진행해요.",
      items: [
        {
          id: "notify",
          label: "점검 일정 확정",
          detail: "팀에 일정을 공유하고 예약된 파이프라인을 일시중지하세요.",
          done: true,
        },
        {
          id: "staging",
          label: "스테이징 환경에서 업그레이드 리허설",
          detail: "소요 시간과 후속 조치가 필요한 사항을 기록하세요.",
          done: true,
        },
        {
          id: "version-stops",
          label: "계획한 중간 버전별 업그레이드 완료",
          detail: "각 단계에서 서비스 상태와 마이그레이션을 점검하세요.",
          done: false,
        },
      ],
    },
    {
      id: "validate",
      name: "업그레이드 후 검증",
      description: "팀이 정상적으로 작업을 이어갈 수 있는지 확인해요.",
      items: [
        {
          id: "smoke-plan",
          label: "스모크 테스트 체크리스트 준비",
          detail:
            "로그인, 저장소 접근, 파이프라인 실행을 점검 항목에 포함하세요.",
          done: true,
        },
        {
          id: "smoke-test",
          label: "애플리케이션과 러너 스모크 테스트 실행",
          detail: "모든 Executor 유형에서 테스트 파이프라인을 실행해 보세요.",
          done: false,
        },
        {
          id: "monitor",
          label: "오류 모니터링 후 점검 종료",
          detail: "인스턴스 상태를 확인하고 팀에 완료 소식을 공유하세요.",
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
    title: "개요",
    url: "/",
    description: "서비스 상태와 파이프라인 현황",
  },
  {
    title: "사용자",
    url: "/users/",
    description: "구성원, 입사자, 퇴사자 관리",
  },
  {
    title: "러너",
    url: "/runners/",
    description: "러너 상태와 리소스 확인",
  },
  {
    title: "업그레이드",
    url: "/upgrade/",
    description: "다음 GitLab 업그레이드 계획",
  },
];
