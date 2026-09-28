import { expect, test } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  loginAsAdmin,
  loginAsUser,
  newApiContext,
  type TestUser
} from "../helpers/users";

test("@permissions regular user cannot list all users", async () => {
  const api = await newApiContext();
  const adminToken = await loginAsAdmin(api);
  let user: TestUser | undefined;

  try {
    user = await createTestUser(api, adminToken);
    const userToken = await loginAsUser(api, user);
    const response = await api.get("/people", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    expect(response.status()).toBe(403);
  } finally {
    if (user) await deleteTestUser(api, adminToken, user.id);
    await api.dispose();
  }
});

test("@permissions admin can list all users", async () => {
  const api = await newApiContext();
  try {
    const adminToken = await loginAsAdmin(api);
    const response = await api.get("/people", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    expect(response.status()).toBe(200);
  } finally {
    await api.dispose();
  }
});
