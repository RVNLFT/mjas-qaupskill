export const requireEnv = (name: "QAU_ADMIN_EMAIL" | "QAU_ADMIN_PASSWORD") => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required ${name} environment variable.`);
  return value;
};
