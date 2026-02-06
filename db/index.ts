import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

config({ path: ".env" });

const client = createClient({
    url: process.env.DB_FILE_NAME!,
});

export const db = drizzle(client);
