
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import postgres from "@prisma/orm-postgres/runtime";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";

import type { Contract } from "./contract.js";
import contractJson from "./contract.json" with { type: "json" };

// Load environment variables from packages/db/.env
const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDir, "../../.env"),
});

// Validate database URL
const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in packages/db/.env");
}

// Initialize Prisma contract
export const contract = contractFromJson<Contract>(contractJson);

// Initialize PostgreSQL client
export const db: PostgresClient<Contract> = postgres({
  contract,
});

// Prevent multiple simultaneous connection attempts
type ConnectionPromise = ReturnType<typeof db.connect>;

let connectionPromise: ConnectionPromise | undefined;

// Connect to PostgreSQL
export function connectDb(): ConnectionPromise {
  if (!connectionPromise) {
    connectionPromise = db
      .connect({
        url: databaseUrl!,
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}
