import { drizzle } from "drizzle-orm/node-postgres";

import { DATABASE_URL } from "../env.ts";

export const db = drizzle(DATABASE_URL);
