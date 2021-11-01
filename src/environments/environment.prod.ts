import { Configuration } from "@helpers/app-initializer/app-initializer";

export const environment = {
  production: true,
  ssrTimeout: 100,
  browserTimeout: 10_000,
  // Version is set by the docker container, edit with care
  version: "<<VERSION_REPLACED_WHEN_BUILT>>",
} as Partial<Configuration> as Configuration;
