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
    page.getByRole("img", { name: /30-day pipeline activity/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "7 days", exact: true }).click();
  await expect(
    page.getByRole("img", { name: /7-day pipeline activity/ }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export report" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "infradash-overview.csv",
  );
});

test("member search, role filter, pagination, tabs, and detail dialog work", async ({
  page,
}) => {
  await page.goto("users/");
  await page.getByRole("button", { name: "Next members" }).click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await page.getByRole("textbox", { name: "Search members" }).fill("Sarah");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Sarah Kim");
  await page.getByRole("button", { name: "View Sarah Kim" }).click();
  await expect(page.getByRole("dialog")).toContainText("Frontend");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search members" })
    .fill("No such person");
  await expect(page.getByText("No members found")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page
    .getByRole("combobox", { name: "Filter by role" })
    .selectOption("Owner");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Min Ji");
  await page.getByRole("tab", { name: /Joiners/ }).click();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await page.getByRole("tab", { name: /Leavers/ }).click();
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator("tbody")).toContainText("Deactivated");
  await page.reload();
  await expect(page.getByRole("tab", { name: /Leavers/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("runner filters, search, and restart dialog stay simulation-only", async ({
  page,
}) => {
  await page.goto("runners/");
  await page.getByRole("button", { name: /^Offline/ }).click();
  await expect(page.locator(".runner-card")).toHaveCount(2);
  await page.getByRole("button", { name: /^Paused/ }).click();
  await expect(page.locator(".runner-card")).toHaveCount(2);
  await page.getByRole("button", { name: /^All runners/ }).click();
  await page
    .getByRole("textbox", { name: "Search runners" })
    .fill("prod-docker-01");
  await expect(page.locator(".runner-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Restart prod-docker-01" }).click();
  await expect(page.getByRole("alertdialog")).toContainText(
    "No runner is restarted",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Restart prod-docker-01" }).click();
  await page
    .getByRole("button", { name: "Simulate restart", exact: true })
    .click();
  await expect(
    page.getByText("Restart simulated", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".runner-card .status-badge")).toHaveText("online");
});

test("upgrade progress persists, updates overview, resets, and exports", async ({
  page,
}) => {
  await page.goto("upgrade/");
  const checkbox = page.getByRole("checkbox", {
    name: /Confirm background migrations/,
  });
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(page.locator(".checklist-progress")).toContainText("67%");
  await page.reload();
  await expect(checkbox).toBeChecked();
  await page.goto("./");
  await expect(page.locator(".upgrade-progress-label")).toContainText(
    "8 of 12",
  );
  await page.goto("upgrade/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export plan" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "infradash-upgrade-plan.txt",
  );
  await page.getByRole("button", { name: "Reset demo checklist" }).click();
  await expect(checkbox).not.toBeChecked();
  await expect(page.locator(".checklist-progress")).toContainText("58%");
});

test("quick navigation, notifications, and profile are usable", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Search pages" }).click();
  await page.getByRole("combobox").fill("runners");
  await page.getByRole("option", { name: /Runners/ }).click();
  await expect(page).toHaveURL(/runners\/$/);
  await page.getByRole("button", { name: "View notifications" }).click();
  await expect(page.getByRole("dialog")).toContainText("Workspace updates");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "View profile" }).click();
  await expect(page.getByRole("dialog")).toContainText("Min Ji");
});

test("sidebar navigation supports all four pages", async ({
  page,
  isMobile,
}) => {
  await page.goto("./");
  for (const title of ["Users", "Runners", "Upgrade", "Overview"]) {
    if (isMobile)
      await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    const nav = page.getByRole("navigation", { name: "Main navigation" });
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
