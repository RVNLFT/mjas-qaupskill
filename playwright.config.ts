import { defineConfig, devices } from "@playwright/test";

const requireEnv = (name: "QAU_CLIENT_ORIGIN") => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required ${name} environment variable.`);
  return value;
};

const clientOrigin = requireEnv("QAU_CLIENT_ORIGIN");

export default defineConfig({
  testDir: "./tests",
  globalTeardown: "./global-teardown.ts",
  fullyParallel: false,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: clientOrigin,
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
    url: clientOrigin,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
