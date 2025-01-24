import { Hono } from "hono";
import { registrationController } from "../../controllers/v1/registration.controller.ts";

const registrationRoutes = new Hono();

registrationRoutes.post("/email-pass", registrationController);

export default registrationRoutes;
