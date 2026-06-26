import { Router } from "express";
// import { createProfile, listProfiles } from "../services/file.service.ts";
import type { Request, Response } from "express";
// import type { CreateProfileInput } from "../types/index.ts";

const router = Router();

// router.get("/", async (_req, res: Response) => {
//   const manifest = await listProfiles();
//   res.status(200).json(manifest);
// });

// router.post("/", async (req, res) => {
//   const input: CreateProfileInput = req.body;

//   if (!input.lastName && !input.firstName) {
//     res
//       .status(400)
//       .json({ success: false, message: "First or last name is required" });
//     return;
//   }

//   const profile = await createProfile(input);
//   res
//     .status(201)
//     .json({ success: true, message: "Successfully created a new profile" });
// });

export default router;
