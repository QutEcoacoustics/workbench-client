import { Meta } from "@baw-api/baw-api.service";

export function generateMeta(meta?: Partial<Meta>): Meta {
  return {
    status: 200,
    message: "OK",
    capabilities: {},
    ...meta,
  };
}
