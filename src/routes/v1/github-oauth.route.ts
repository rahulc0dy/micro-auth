import { Hono } from "hono";

import {
  githubOauthCallback,
  githubOAuthRedirect,
} from "../../controllers/v1/github-oauth.controller.ts";

const githubOauthRouter = new Hono();

githubOauthRouter.get("/", githubOAuthRedirect);
githubOauthRouter.get("/callback", githubOauthCallback);

export default githubOauthRouter;
