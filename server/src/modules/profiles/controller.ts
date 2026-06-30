import { sendSuccess } from "../../utils/response.ts";
import type { Request, Response } from "express";
import type { IProfileService } from "./types.ts";
import type { CreateProfileBody, ParameterId } from "./schemas.ts";

export class ProfileController {
  constructor(private readonly service: IProfileService) {}

  getAll = async (_req: Request, res: Response) => {
    const profiles = await this.service.getAllProfiles();
    sendSuccess({ res, data: profiles });
  };

  getOne = async (req: Request, res: Response) => {
    const params = req.params as ParameterId;
    const profile = await this.service.getProfile(params.id);
    sendSuccess({ res, data: profile });
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

  update = async (req: Request, res: Response) => {
    const params = req.params as ParameterId;
    const body = req.body as CreateProfileBody;
    const profile = await this.service.updateProfile(params.id, body);
    sendSuccess({
      res,
      data: profile,
      message: "Successfully updated the profile",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const params = req.params as ParameterId;
    const profile = await this.service.deleteProfile(params.id);
    sendSuccess({
      res,
      data: profile,
      message: "Successfully deleted the profile",
      httpStatus: 201,
    });
  };
}
