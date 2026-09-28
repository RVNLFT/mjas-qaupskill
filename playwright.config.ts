import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  globalTeardown: "./global-teardown.ts",
  fullyParallel: false,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4321",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/
    },
    {
      name: "chromium",
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json"
      },
      dependencies: ["setup"]
    },
    {
      name: "mobile-chrome",
      testIgnore: /auth\.setup\.ts/,
      grep: /@smoke/,
      use: {
        ...devices["Pixel 7"],
        storageState: "playwright/.auth/admin.json"
      },
      dependencies: ["setup"]
    }
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
