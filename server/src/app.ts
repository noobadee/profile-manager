import express from "express";
import morgan from "morgan";
import { profileRouter } from "./modules/profiles/router.ts";
import { errorHandler } from "./common/middleware/errorHandler.ts";
import { isTest } from "./config/env.ts";
import cors from "cors";
import { env } from "./config/env.ts";
import type { Request, Response } from "express";

const app = express();

// ──── CORS ────────────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  morgan("dev", {
    skip: () => isTest(),
  }),
);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Profile Manager",
  });
});

app.use("/api/profiles", profileRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    errorCode: "ROUTE_NOT_FOUND",
    message: "The requested route does not exist",
  });
});

app.use(errorHandler);

export default app;
