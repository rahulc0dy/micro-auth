import { Hono } from "hono";

import {
  githubOuthCallback,
  githubOuthRedirect,
} from "../../controllers/v1/github-oauth.controller.ts";

const githubOauthRouter = new Hono();

githubOauthRouter.get("/", githubOuthRedirect);
githubOauthRouter.get("/callback", githubOuthCallback);

export default githubOauthRouter;
