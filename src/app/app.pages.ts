import { aboutPageComponents } from "@components/about/about.pages";
import { adminPageComponents } from "@components/admin/admin.pages";
import { analysisJobPageComponents } from "@components/audio-analysis/analysis-jobs.pages";
import { scriptsPageComponents } from "@components/scripts/scripts.pages";
import { audioRecordingPageComponents } from "@components/audio-recordings/audio-recording.pages";
import { citizenSciencePageComponents } from "@components/citizen-science/citizen-science.pages";
import { dataRequestPageComponents } from "@components/data-request/data-request.pages";
import { harvestPageComponents } from "@components/harvest/harvest.pages";
import { reportsPageComponents } from "@components/reports/reports.pages";
import { annotationPageComponents } from "@components/annotations/annotation.pages";
import { importAnnotationsPageComponents } from "@components/import-annotations/import-annotations.pages";
import { libraryPageComponents } from "@components/library/library.pages";
import { listenPageComponents } from "@components/listen/listen.pages";
import {
  myProfilePageComponents,
  theirProfilePageComponents,
} from "@components/profile/profile.pages";
import { projectPageComponents } from "@components/projects/projects.pages";
import { regionPageComponents } from "@components/regions/regions.pages";
import { reportProblemPageComponents } from "@components/report-problem/report-problem.pages";
import { securityPageComponents } from "@components/security/security.pages";
import { sendAudioPageComponents } from "@components/send-audio/send-audio.pages";
import { sitePageComponents } from "@components/sites/sites.pages";
import { websiteStatusPageComponents } from "@components/website-status/website-status.pages";
import { visualizePageComponents } from "@components/visualize/visualize.pages";
import { PageComponent } from "@helpers/page/pageComponent";
import { Type } from "@angular/core";
import { homePageComponents } from "@components/home/home.pages";
import { errorPageComponents } from "@components/error/error.module";

// For some reason, if we use the spread operator here instead of .flat(), the
// imported components will be tree shaken away and will not be included in the
// final bundle.
export const appPageComponents: Type<PageComponent>[] = [
  aboutPageComponents,
  adminPageComponents,
  analysisJobPageComponents,
  scriptsPageComponents,
  audioRecordingPageComponents,
  citizenSciencePageComponents,
  dataRequestPageComponents,
  harvestPageComponents,
  reportsPageComponents,
  annotationPageComponents,
  importAnnotationsPageComponents,
  libraryPageComponents,
  listenPageComponents,
  myProfilePageComponents,
  theirProfilePageComponents,
  projectPageComponents,
  regionPageComponents,
  reportProblemPageComponents,
  securityPageComponents,
  sendAudioPageComponents,
  sitePageComponents,
  websiteStatusPageComponents,
  visualizePageComponents,

  // these two must be last
  homePageComponents,
  errorPageComponents,
].flat();
