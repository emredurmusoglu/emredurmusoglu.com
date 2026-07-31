import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL tanımlı değil. .env.local dosyasına connection string'ini ekle (bkz. .env.example).",
  );
}

/**
 * Neon'un HTTP sürücüsü serverless'ta doğru seçim, ama yerel Postgres'e
 * konuşamıyor. Bu yüzden host'a bakıp sürücüyü seçiyoruz — böylece
 * `postgresql://localhost/...` ile internetsiz de geliştirebiliyorsun.
 * Kullandığımız sorgu API'si iki sürücüde de birebir aynı.
 */
const isNeon = /\.neon\.(tech|build)$/.test(new URL(connectionString).hostname);

export const db = (
  isNeon
    ? drizzleNeon(neon(connectionString), { schema })
    : drizzlePg(connectionString, { schema })
) as NeonHttpDatabase<typeof schema>;

export { schema };
