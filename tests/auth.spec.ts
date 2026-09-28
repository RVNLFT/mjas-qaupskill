import { randomBytes } from "node:crypto";
import { expect, test } from "../fixtures/test";
import { createTestUser, deleteTestUser, loginAsAdmin, newApiContext, type TestUser } from "../helpers/users";

test("@auth newly created account can log in", async ({ loginPage, page }) => {
  const api = await newApiContext();
  const adminToken = await loginAsAdmin(api);
  let user: TestUser | undefined;

  try {
    user = await createTestUser(api, adminToken);
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  } finally {
    if (user) await deleteTestUser(api, adminToken, user.id);
    await api.dispose();
  }
});

test("@auth invalid password is rejected", async ({ loginPage, page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await loginPage.navigate();
  await loginPage.login("unknown@example.invalid", `Invalid-${randomBytes(18).toString("base64url")}!`);
  await expect(page.getByText("Invalid email or password.")).toBeVisible();
});
