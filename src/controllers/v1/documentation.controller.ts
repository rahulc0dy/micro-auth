import type { Context } from "hono";

import { openapiJsonParser } from "../../utils/openapi-json-parser.ts";

export const openApiJsonController = async (c: Context) => {
  const documentation = await openapiJsonParser();

  return c.json(documentation);
};
