import Router from "express";
import { ProfileRepository } from "./repository.ts";
import { ProfileService } from "./service.ts";
import { ProfileController } from "./controller.ts";
import { validate } from "../../common/middleware/validation.ts";
import { CreateProfileSchema, ParameterIdSchema } from "./schemas.ts";

const router = Router();

const repository = new ProfileRepository();
const service = new ProfileService(repository);
const controller = new ProfileController(service);

router.get("/", controller.getAll);
router.post("/", validate({ body: CreateProfileSchema }), controller.create);
router.put(
  "/:id",
  validate({ params: ParameterIdSchema, body: CreateProfileSchema }),
  controller.update,
);

export { router as profileRouter };
