import { Configuration } from "@helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Configuration = {
  production: true,
  version,
} as any;
