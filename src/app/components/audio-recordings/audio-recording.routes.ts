import { systemAnalysisJob } from "@baw-api/analysis/analysis-jobs.service";
import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

// audio recording routes
const showRoutePath = ":audioRecordingId";
const listRoutePath = "audio_recordings";
const batchDownloadRoutePath = "download";

// analysis job routes (extends audio recording routes)
const analysisRoutePath = "analysis_jobs";
const analysisShowRoutePath = ":analysisJobId";
const resultsPath = "results";

export type RecordingRoute =
  | "base"
  | "site"
  | "siteAndRegion"
  | "region"
  | "project";
export type RecordingStrongRoutes = Record<RecordingRoute, StrongRoute>;

export type AnalysisRoute =
  | "base"
  | "site"
  | "siteAndRegion"
  | "region"
  | "project";
export type AnalysisStrongRoutes = Record<AnalysisRoute, StrongRoute>;

// Create audio recording base route, and sub routes
export const audioRecordingsRoutes: RecordingStrongRoutes = {
  /** /audio_recordings */
  base: StrongRoute.newRoot().add(listRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings */
  site: siteRoute.addFeatureModule(listRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings */
  siteAndRegion: pointRoute.addFeatureModule(listRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings */
  region: regionRoute.addFeatureModule(listRoutePath),
  /** /project/:projectId/audio_recordings */
  project: projectRoute.addFeatureModule(listRoutePath),
};

export const audioRecordingRoutes: RecordingStrongRoutes = {
  /** /audio_recordings/:audioRecordingId */
  base: audioRecordingsRoutes.base.add(showRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId */
  site: audioRecordingsRoutes.site.add(showRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId */
  siteAndRegion: audioRecordingsRoutes.siteAndRegion.add(showRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId */
  region: audioRecordingsRoutes.region.add(showRoutePath),
  /** /project/:projectId/audio_recordings/:audioRecordingId */
  project: audioRecordingsRoutes.project.add(showRoutePath),
};

export const audioRecordingBatchRoutes: RecordingStrongRoutes = {
  /** /audio_recordings/download */
  base: audioRecordingsRoutes.base.add(batchDownloadRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings/download */
  site: audioRecordingsRoutes.site.add(batchDownloadRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/download */
  siteAndRegion: audioRecordingsRoutes.siteAndRegion.add(
    batchDownloadRoutePath
  ),
  /** /project/:projectId/region/:regionId/audio_recordings/download */
  region: audioRecordingsRoutes.region.add(batchDownloadRoutePath),
  /** /project/:projectId/audio_recordings/download */
  project: audioRecordingsRoutes.project.add(batchDownloadRoutePath),
};

export const analysisJobsRoutes: AnalysisStrongRoutes = {
  /** /audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId/analysis_jobs */
  base: audioRecordingRoutes.base.add(analysisRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs */
  site: audioRecordingRoutes.site.add(analysisRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs */
  siteAndRegion: audioRecordingRoutes.siteAndRegion.add(analysisRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId/analysis_jobs */
  region: audioRecordingRoutes.region.add(analysisRoutePath),
  /** /project/:projectId/audio_recordings/analysis_jobs */
  project: audioRecordingRoutes.project.add(analysisRoutePath),
};

export const analysisJobRoute: AnalysisStrongRoutes = {
  /** /audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId */
  base: analysisJobsRoutes.base.add(analysisShowRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId */
  site: analysisJobsRoutes.site.add(analysisShowRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId */
  siteAndRegion: analysisJobsRoutes.siteAndRegion.add(analysisShowRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId */
  region: analysisJobsRoutes.region.add(analysisShowRoutePath),
  /** /project/:projectId/audio_recordings/analysis_jobs/:analysisJobId */
  project: analysisJobsRoutes.project.add(analysisShowRoutePath),
};

export const systemAnalysisJobRoute: AnalysisStrongRoutes = {
  /** /audio_recordings/:audioRecordingId/analysis_jobs/system */
  base: analysisJobsRoutes.base.add(systemAnalysisJob.id.toString()),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/system */
  site: analysisJobsRoutes.site.add(systemAnalysisJob.id.toString()),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/system */
  siteAndRegion: analysisJobsRoutes.siteAndRegion.add(systemAnalysisJob.id.toString()),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId/analysis_jobs/system */
  region: analysisJobsRoutes.region.add(systemAnalysisJob.id.toString()),
  /** /project/:projectId/audio_recordings/analysis_jobs/system */
  project: analysisJobsRoutes.project.add(systemAnalysisJob.id.toString()),
};

export const analysisResultsRoutes: AnalysisStrongRoutes = {
  /** /audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId/results */
  base: analysisJobRoute.base.add(resultsPath),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId/results */
  site: analysisJobRoute.site.add(resultsPath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId/results */
  siteAndRegion: analysisJobRoute.siteAndRegion.add(resultsPath),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId/analysis_jobs/:analysisJobId/results */
  region: analysisJobRoute.region.add(resultsPath),
  /** /project/:projectId/audio_recordings/analysis_jobs/:analysisJobId/results */
  project: analysisJobRoute.project.add(resultsPath),
};
