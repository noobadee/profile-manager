import Router from "express";
import { ProfileRepository } from "./repository.ts";
import { ProfileService } from "./service.ts";
import { ProfileController } from "./controller.ts";
import { validate } from "../../middleware/validation.ts";
import { CreateProfileSchema } from "./schemas.ts";

const router = Router();

const repository = new ProfileRepository();
const service = new ProfileService(repository);
const controller = new ProfileController(service);

router.get("/", controller.getAll);
router.post("/", validate({ body: CreateProfileSchema }), controller.create);

export { router as profilesRouter };
