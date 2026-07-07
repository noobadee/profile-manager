import { env as loadEnv } from "custom-env";
import * as z from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

// Load specific .env files
if (isDevelopment) {
  loadEnv();
} else if (isTesting) {
  loadEnv("test");
}

const envSchema = z.object({
  SERVER_PORT: z.coerce
    .number()
    .int()
    .min(1, "Server port is required")
    .max(65535, "Server port cannot exceed 65,535")
    .default(3000),
  CLIENT_ORIGIN: z.string().min(1, "Client origin is required"),
  APP_STAGE: z.enum(["dev", "test", "production"]).default("dev"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
