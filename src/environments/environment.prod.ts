import { Configuration } from "src/app/services/app-config/app-config.service.js";
import { version } from "../../package.json";

export const environment: Partial<Configuration> = {
  production: true,
  version
};
