import { Routes } from "@angular/router";
import { aboutRoute } from "@components/about/about.menus";
import { adminRoute } from "@components/admin/admin.menus";
import { verificationRoute } from "@components/annotations/annotation.routes";
import { analysesRoute } from "@components/audio-analysis/analysis-jobs.routes";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { dataRequestRoute } from "@components/data-request/data-request.menus";
import { pageNotFoundRoute } from "@components/error/error.menus";
import { harvestsRoute } from "@components/harvest/harvest.routes";
import { homeRoute } from "@components/home/home.menus";
import { annotationsImportRoute } from "@components/import-annotations/import-annotations.routes";
import { libraryRoute } from "@components/library/library.menus";
import { listenRoute } from "@components/listen/listen.menus";
import {
  myAccountRoute,
  theirProfileRoute,
} from "@components/profile/profile.menus";
import { projectsRoute } from "@components/projects/projects.routes";
import {
  regionsRoute,
  shallowRegionsRoute,
} from "@components/regions/regions.routes";
import { reportProblemsRoute } from "@components/report-problem/report-problem.menus";
import { reportsRoute } from "@components/reports/reports.routes";
import { scriptsRoute } from "@components/scripts/scripts.routes";
import { securityRoute } from "@components/security/security.menus";
import { sendAudioRoute } from "@components/send-audio/send-audio.menus";
import { pointsRoute } from "@components/sites/points.routes";
import { sitesRoute } from "@components/sites/sites.routes";
import { statisticsRoute } from "@components/statistics/statistics.menus";
import { visualizeRoute } from "@components/visualize/visualize.routes";
import { websiteStatusRoute } from "@components/website-status/website-status.routes";
import {
  getRouteConfigForIndexed,
  getRouteConfigForPage,
} from "@helpers/page/pageRouting";

const staticRoutes = [
  {
    path: "research",
    children: [
      { path: "about", redirectTo: "https://research.ecosounds.org/" },
      {
        path: "articles",
        redirectTo: "https://research.ecosounds.org/articles.html",
      },
      {
        path: "resources",
        redirectTo: "https://research.ecosounds.org/resources.html",
      },
      {
        path: "people",
        redirectTo: "https://research.ecosounds.org/people/people.html",
      },
      {
        path: "publications",
        redirectTo:
          "https://research.ecosounds.org/publications/publications.html",
      },
    ],
  },
] as const satisfies Routes;

export const routes: Routes = [
  aboutRoute.compileRoutes(getRouteConfigForPage),
  adminRoute.compileRoutes(getRouteConfigForPage),
  analysesRoute.compileRoutes(getRouteConfigForPage),
  scriptsRoute.compileRoutes(getRouteConfigForPage),
  getRouteConfigForIndexed(audioRecordingsRoutes),
  citSciRoute.compileRoutes(getRouteConfigForPage),
  dataRequestRoute.compileRoutes(getRouteConfigForPage),
  harvestsRoute.compileRoutes(getRouteConfigForPage),
  getRouteConfigForIndexed(reportsRoute),
  getRouteConfigForIndexed(verificationRoute),
  annotationsImportRoute.compileRoutes(getRouteConfigForPage),
  libraryRoute.compileRoutes(getRouteConfigForPage),
  listenRoute.compileRoutes(getRouteConfigForPage),
  myAccountRoute.compileRoutes(getRouteConfigForPage),
  theirProfileRoute.compileRoutes(getRouteConfigForPage),
  projectsRoute.compileRoutes(getRouteConfigForPage),
  regionsRoute.compileRoutes(getRouteConfigForPage),
  shallowRegionsRoute.compileRoutes(getRouteConfigForPage),
  reportProblemsRoute.compileRoutes(getRouteConfigForPage),
  securityRoute.compileRoutes(getRouteConfigForPage),
  sendAudioRoute.compileRoutes(getRouteConfigForPage),
  sitesRoute.compileRoutes(getRouteConfigForPage),
  pointsRoute.compileRoutes(getRouteConfigForPage),
  statisticsRoute.compileRoutes(getRouteConfigForPage),
  websiteStatusRoute.compileRoutes(getRouteConfigForPage),
  visualizeRoute.compileRoutes(getRouteConfigForPage),

  // these two must be last
  homeRoute.compileRoutes(getRouteConfigForPage),
  pageNotFoundRoute.compileRoutes(getRouteConfigForPage),

  ...staticRoutes,
].flat();
