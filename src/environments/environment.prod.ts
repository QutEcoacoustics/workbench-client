import { version } from "../../package.json";

export const environment = {
  production: true,
  version,

  // This will be updated by the appConfig service
  googleMapsKey: ""
};
