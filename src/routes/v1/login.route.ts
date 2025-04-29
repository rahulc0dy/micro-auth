import { Hono } from "hono";

import { emailPassLoginController } from "../../controllers/v1/login.controller.ts";

const loginRouter = new Hono();

loginRouter.post("/email-pass", emailPassLoginController);

export default loginRouter;
