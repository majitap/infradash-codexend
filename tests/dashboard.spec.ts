import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("every exported route loads without runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const external: string[] = [];
  page.on("request", (request) => {
    if (
      !["127.0.0.1", "localhost", "majitap.github.io"].includes(
        new URL(request.url()).hostname,
      )
    )
      external.push(request.url());
  });
  for (const route of ["", "users/", "runners/", "upgrade/"]) {
    const response = await page.goto(route || "./");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    await expect(page.getByRole("main")).toHaveCount(1);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(page.locator("main")).not.toContainText("Create Next App");
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("overview chart changes range and exports the mock report", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("img", { name: /최근 30일 파이프라인 현황/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "7일", exact: true }).click();
  await expect(
    page.getByRole("img", { name: /최근 7일 파이프라인 현황/ }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "보고서 내보내기" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "infradash-overview.csv",
  );
});

test("member search, role filter, pagination, tabs, and detail dialog work", async ({
  page,
}) => {
  await page.goto("users/");
  await page.getByRole("button", { name: "다음 구성원 페이지" }).click();
  await expect(page.getByText("2 / 2 페이지")).toBeVisible();
  await page.getByRole("textbox", { name: "구성원 검색" }).fill("Sarah");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Sarah Kim");
  await page.getByRole("button", { name: "Sarah Kim 상세 보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("프론트엔드");
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page
    .getByRole("textbox", { name: "구성원 검색" })
    .fill("No such person");
  await expect(page.getByText("검색된 구성원이 없어요")).toBeVisible();
  await page.getByRole("button", { name: "필터 초기화" }).click();
  await page.getByRole("combobox", { name: "역할 필터" }).selectOption("Owner");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Min Ji");
  await page.getByRole("tab", { name: /입사자/ }).click();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await page.getByRole("tab", { name: /퇴사자/ }).click();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator("tbody")).toContainText("비활성");
  await page.reload();
  await expect(page.getByRole("tab", { name: /퇴사자/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("runner filters, search, and restart dialog stay simulation-only", async ({
  page,
}) => {
  await page.goto("runners/");
  await page.getByRole("button", { name: /^오프라인/ }).click();
  await expect(page.locator(".runner-card")).toHaveCount(2);
  await page.getByRole("button", { name: /^일시중지/ }).click();
  await expect(page.locator(".runner-card")).toHaveCount(2);
  await page.getByRole("button", { name: /^전체 러너/ }).click();
  await page.getByRole("textbox", { name: "러너 검색" }).fill("prod-docker-01");
  await expect(page.locator(".runner-card")).toHaveCount(1);
  await page.getByRole("button", { name: "prod-docker-01 재시작" }).click();
  await expect(page.getByRole("alertdialog")).toContainText(
    "실제 러너를 재시작하거나 요청을 보내지 않습니다.",
  );
  await page.getByRole("button", { name: "취소", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await page.getByRole("button", { name: "prod-docker-01 재시작" }).click();
  await page
    .getByRole("button", { name: "재시작 체험하기", exact: true })
    .click();
  await expect(
    page.getByText("재시작 시뮬레이션을 완료했어요", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".runner-card .status-badge")).toHaveText("온라인");
});

test("upgrade progress persists, updates overview, resets, and exports", async ({
  page,
}) => {
  await page.goto("upgrade/");
  const checkbox = page.getByRole("checkbox", {
    name: /백그라운드 마이그레이션 완료 확인/,
  });
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(page.locator(".checklist-progress")).toContainText("67%");
  await page.reload();
  await expect(checkbox).toBeChecked();
  await page.goto("./");
  await expect(page.locator(".upgrade-progress-label")).toContainText(
    "12개 중 8개 완료",
  );
  await page.goto("upgrade/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "계획 내보내기" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "infradash-upgrade-plan.txt",
  );
  await page.getByRole("button", { name: "데모 체크리스트 초기화" }).click();
  await expect(checkbox).not.toBeChecked();
  await expect(page.locator(".checklist-progress")).toContainText("58%");
});

test("quick navigation, notifications, and profile are usable", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "페이지 검색" }).click();
  await page.getByRole("combobox").fill("러너");
  await page.getByRole("option", { name: /러너/ }).click();
  await expect(page).toHaveURL(/runners\/$/);
  await page.getByRole("button", { name: "알림 보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("워크스페이스 알림");
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.getByRole("button", { name: "프로필 보기" }).click();
  await expect(page.getByRole("dialog")).toContainText("Min Ji");
});

test("sidebar navigation supports all four pages", async ({
  page,
  isMobile,
}) => {
  await page.goto("./");
  for (const title of ["사용자", "러너", "업그레이드", "개요"]) {
    if (isMobile)
      await page.getByRole("button", { name: "사이드바 열기/닫기" }).click();
    const nav = page.getByRole("navigation", { name: "주 메뉴" });
    await nav.getByRole("link", { name: new RegExp("^" + title) }).click();
    await expect(page.locator("h1")).toBeVisible();
    if (!isMobile)
      await expect(
        nav.getByRole("link", { name: new RegExp("^" + title) }),
      ).toHaveAttribute("aria-current", "page");
  }
});

test("all four pages meet WCAG 2.1 AA automated accessibility checks", async ({
  page,
}) => {
  for (const route of ["./", "users/", "runners/", "upgrade/"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.length,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        null,
        2,
      ),
    ).toBe(0);
  }
});
