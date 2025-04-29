import { Hono } from "hono";

import { registrationController } from "../../controllers/v1/registration.controller.ts";

const registrationRouter = new Hono();

registrationRouter.post("/email-pass", registrationController);

export default registrationRouter;
