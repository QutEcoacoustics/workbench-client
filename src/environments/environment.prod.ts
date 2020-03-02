import { Configuration } from "src/app/helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Configuration = {
  production: true,
  version
} as any;
