import { aboutRoute } from "@components/about/about.menus";
import { adminRoute } from "@components/admin/admin.menus";
import { adminAnalysisJobsRoute } from "@components/admin/analysis-jobs/analysis-jobs.menus";
import { adminOrphansRoute } from "@components/admin/orphan/orphans.menus";
import { adminSettingsRoute } from "@components/admin/settings/settings.menus";
import { adminTagGroupsRoute } from "@components/admin/tag-group/tag-group.menus";
import { adminTagsRoute } from "@components/admin/tags/tags.menus";
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
import { securityRoute } from "@components/security/security.routes";
import { sendAudioRoute } from "@components/send-audio/send-audio.menus";
import { pointsRoute } from "@components/sites/points.routes";
import { sitesRoute } from "@components/sites/sites.routes";
import { statisticsRoute } from "@components/statistics/statistics.menus";
import { provenancesRoute } from "@components/provenances/provenances.routes";
import { visualizeRoute } from "@components/visualize/visualize.routes";
import { websiteStatusRoute } from "@components/website-status/website-status.routes";
import {
  compileAndSplitRoutes,
  splitIndexedStrongRoutes,
} from "@helpers/page/pageRouting";
import { StrongRoute } from "@interfaces/strongRoute";

const researchRoutes = StrongRoute.newRoot().add("research");
researchRoutes.add("about", null, {
  redirectTo: "https://research.ecosounds.org/",
});
researchRoutes.add("about", null, {
  redirectTo: "https://research.ecosounds.org/articles.html",
});
researchRoutes.add("resources", null, {
  redirectTo: "https://research.ecosounds.org/resources.html",
});
researchRoutes.add("people", null, {
  redirectTo: "https://research.ecosounds.org/people/people.html",
});
researchRoutes.add("publications", null, {
  redirectTo: "https://research.ecosounds.org/publications/publications.html",
});

const routes: StrongRoute[] = [
  aboutRoute,
  adminRoute,
  analysesRoute,
  scriptsRoute,
  ...splitIndexedStrongRoutes(audioRecordingsRoutes),
  citSciRoute,
  dataRequestRoute,
  harvestsRoute,
  ...splitIndexedStrongRoutes(reportsRoute),
  ...splitIndexedStrongRoutes(verificationRoute),
  annotationsImportRoute,
  libraryRoute,
  listenRoute,
  myAccountRoute,
  theirProfileRoute,
  projectsRoute,
  regionsRoute,
  shallowRegionsRoute,
  reportProblemsRoute,
  securityRoute,
  sendAudioRoute,
  sitesRoute,
  pointsRoute,
  provenancesRoute,
  statisticsRoute,
  websiteStatusRoute,
  visualizeRoute,
  adminTagsRoute,
  adminOrphansRoute,
  adminSettingsRoute,
  adminTagGroupsRoute,
  adminAnalysisJobsRoute,

  researchRoutes,

  homeRoute,
  pageNotFoundRoute,
];

export const [clientRoutes, serverRoutes] = compileAndSplitRoutes(routes);
