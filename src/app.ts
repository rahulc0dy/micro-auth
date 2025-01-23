import {Hono} from "hono";
import {registerV1Routes} from "./routes/v1/routes.config.ts";
import {reqLogMiddleware} from "./middlewares/requestLog.middleware.ts";

const app = new Hono();

app.use("*", reqLogMiddleware);
registerV1Routes(app);

export default app;
