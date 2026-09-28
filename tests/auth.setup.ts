import fs from "node:fs";
import path from "node:path";
import { expect, test as setup } from "@playwright/test";
import { apiUrl } from "../helpers/users";
import { requireEnv } from "../helpers/env";

const authFile = path.resolve("playwright/.auth/admin.json");

setup("authenticate admin through API", async ({ page, request }) => {
  const response = await request.post(`${apiUrl}/auth/login`, {
    data: {
      email: requireEnv("QAU_ADMIN_EMAIL"),
      password: requireEnv("QAU_ADMIN_PASSWORD")
    }
  });

  expect(response.ok()).toBeTruthy();
  const { token } = await response.json();

  await page.addInitScript((jwt: string) => {
    localStorage.setItem("qa-upskill-token", jwt);
  }, token);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
