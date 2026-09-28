import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "../fixtures/test";
import {
  createTestUser,
  deleteTestUser,
  loginAsAdmin,
  newApiContext,
  type TestUser
} from "../helpers/users";

let api: APIRequestContext;
let adminToken: string;
let user: TestUser;

test.beforeAll(async () => {
  api = await newApiContext();
  adminToken = await loginAsAdmin(api);
  user = await createTestUser(api, adminToken);
});

test.beforeEach(async ({ loginPage, page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await loginPage.navigate();
  await loginPage.login(user.email, user.password);
});

test("@smoke dashboard loads after login", async ({ page }) => {
  await expect(page.locator(".dashboard")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Playwright User", level: 2 })).toBeVisible();
});

test.afterAll(async () => {
  if (user) await deleteTestUser(api, adminToken, user.id);
  if (api) await api.dispose();
});
