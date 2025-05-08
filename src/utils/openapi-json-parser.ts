import { readFile } from "fs/promises";
import path from "path";

export const openapiJsonParser = async () => {
  const openapiPath = path.join(process.cwd(), "docs", "openapi.json");
  const file = await readFile(openapiPath, "utf-8");
  return JSON.parse(file);
};
