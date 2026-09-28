import { expect, test } from "../fixtures/test";

test("@smoke login page loads", async ({ loginPage, page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await loginPage.navigate();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

test("@smoke application header is visible", async ({ loginPage, page }) => {
  await loginPage.navigate();
  await expect(page.getByRole("heading", { name: "Workspace for QA." })).toBeVisible();
});
