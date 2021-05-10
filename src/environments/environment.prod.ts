import { Configuration } from "@helpers/app-initializer/app-initializer";

export const environment = ({
  production: true,
  // Version is set by the docker container, do not modify them
  version: "",
} as Partial<Configuration>) as Configuration;
