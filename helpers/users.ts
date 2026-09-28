import { randomBytes, randomUUID } from "node:crypto";
import { expect, request, type APIRequestContext } from "@playwright/test";
import { requireEnv } from "./env";

export const apiUrl = requireEnv("QAU_PUBLIC_API_URL");

export type TestUser = {
  id: number;
  email: string;
  password: string;
};

export const newApiContext = () => request.newContext({ baseURL: apiUrl });

export const loginAsAdmin = async (api: APIRequestContext) => {
  const response = await api.post("/auth/login", {
    data: {
      email: requireEnv("QAU_ADMIN_EMAIL"),
      password: requireEnv("QAU_ADMIN_PASSWORD")
    }
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).token as string;
};

export const createTestUser = async (api: APIRequestContext, adminToken: string): Promise<TestUser> => {
  const email = `playwright-${randomUUID()}@example.invalid`;
  const password = `Pw-${randomBytes(18).toString("base64url")}!`;
  const response = await api.post("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { fullName: "Playwright User", email, password, role: "User" }
  });
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  return { id, email, password };
};

export const deleteTestUser = async (api: APIRequestContext, adminToken: string, userId: number) => {
  const response = await api.delete(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  expect(response.status()).toBe(204);
};

export const loginAsUser = async (api: APIRequestContext, user: TestUser) => {
  const response = await api.post("/auth/login", {
    data: { email: user.email, password: user.password }
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).token as string;
};
