import { IConfiguration } from "@helpers/app-initializer/app-initializer";

export const defaultConfig: IConfiguration = {
  kind: "Configuration",
  endpoints: {
    environment: "development",
    apiRoot: "https://api.staging.ecosounds.org",
    clientOrigin: "https://development.ecosounds.org:4200",
    clientDir: "/",
    oldClientOrigin: "https://api.staging.ecosounds.org",
    oldClientBase: "/listen_to/index.html"
  },
  keys: {
    googleMaps: "",
    googleAnalytics: {
      domain: "",
      trackingId: ""
    }
  },
  settings: {
    brand: {
      short: "Baw Web Components",
      long: "Baw Web Components",
      organization: "Open Ecoacoustics"
    },
    links: {
      sourceRepository: "https://github.com/QutEcoacoustics/workbench-client",
      sourceRepositoryIssues: "https://github.com/QutEcoacoustics/workbench-client/issues",
      harvestFilenameGuide: "https://github.com/ecoacoustics/metadata-standard/blob/master/filenames.md"
    },
    hideProjects: false,
    homePageAndProjectListMaps: true,
    customMenu: [],
    theme: {
      highlight: "#00467f"
    }
  },
};
