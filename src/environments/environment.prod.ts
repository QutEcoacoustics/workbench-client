import { Environment } from "src/app/helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Environment = {
  production: true,
  version
} as any;
