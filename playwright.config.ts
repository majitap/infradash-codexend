import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: 3,
  reporter: "list",
  use: {
    baseURL:
      process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000/infradash-codexend/",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run preview",
        url: "http://127.0.0.1:3000/infradash-codexend/",
        reuseExistingServer: !process.env.CI,
      },
});
