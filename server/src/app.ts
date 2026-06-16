import express from "express";
import type { Request, Response } from "express";
import profileRoutes from "./routes/profile.routes.ts";
// import { startWatcher } from "./watcher.ts";

const app = express();

app.use(express.json());

app.use("/api/profiles", profileRoutes);

app.get("/health", (_req, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Profile Manager",
  });
});

// app.post("/save", async (req: Request<{}, {}, SaveFileBody>, res: Response) => {
//   const { fileName, fileContent } = req.body;

//   if (!fileName || !fileContent) {
//     return res.status(400).json({
//       error: "Filename and content are required",
//     });
//   }

//   try {
//     const filePath = await saveFile(fileName, fileContent);
//     return res.status(201).json({ message: "File saved.", filePath: filePath });
//   } catch (err) {
//     console.error("❌", err);
//     return res.status(500).json({ error: "Failed to save file." });
//   }
// });

export default app;
