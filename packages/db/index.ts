import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./prisma/types";

export { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

export * from "./prisma/types";
export * from "./prisma/enums";

/**
 * Standard Postgres via Kysely — works on Railway and local Postgres.
 * Pool connects lazily on first query (safe for Next.js build page collection).
 */
const connectionString =
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL ??
  "postgresql://build:build@127.0.0.1:5432/build";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString }),
  }),
});
