import fs from "node:fs";
import path from "node:path";

export default function globalTeardown() {
  const authDirectory = path.resolve("playwright/.auth");
  const authFile = path.join(authDirectory, "admin.json");

  fs.rmSync(authFile, { force: true });

  try {
    fs.rmdirSync(authDirectory);
  } catch {
    // Keep the directory when it contains another ignored authentication state.
  }
}
