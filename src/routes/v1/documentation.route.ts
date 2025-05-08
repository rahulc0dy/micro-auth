import { Hono } from "hono";

import { openApiJsonController } from "../../controllers/v1/documentation.controller.ts";

const documentationRouter = new Hono();

documentationRouter.get("/openapi-json", openApiJsonController);

export default documentationRouter;
