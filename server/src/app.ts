import express from "express";
import type { Request, Response } from "express";
import { profilesRouter } from "./modules/profiles/router.ts";

const app = express();

app.use(express.json());

app.get("/health", (_req, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Profile Manager",
  });
});

app.use("/api/profiles", profilesRouter);

export default app;
