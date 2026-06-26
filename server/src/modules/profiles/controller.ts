import { sendSuccess } from "../../utils/response.ts";
import type { Request, Response } from "express";
import type { IProfileService } from "./types.ts";
import type { CreateProfileBody } from "./schemas.ts";

export class ProfileController {
  constructor(private readonly service: IProfileService) {}

  getAll = async (_req: Request, res: Response) => {
    const profiles = await this.service.getAllProfiles();
    sendSuccess({ res, data: profiles });
  };

  create = async (req: Request, res: Response) => {
    const body = req.body as CreateProfileBody;
    const profile = await this.service.createProfile(body);
    sendSuccess({
      res,
      data: profile,
      message: "Successfully created a new profile",
      httpStatus: 201,
    });
  };
}
