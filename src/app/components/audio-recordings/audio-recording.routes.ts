import { projectRoute } from "@components/projects/projects.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { pointRoute } from "@components/sites/points.routes";
import { siteRoute } from "@components/sites/sites.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const listRoutePath = "audio_recordings";
const showRoutePath = ":audioRecordingId";
const batchDownloadRoutePath = "download";

export type RecordingRoute = "base" | "site" | "siteAndRegion" | "region" | "project";
export type RecordingStrongRoutes = Record<RecordingRoute, StrongRoute>;

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
  siteAndRegion: audioRecordingsRoutes.siteAndRegion.add(batchDownloadRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings/download */
  region: audioRecordingsRoutes.region.add(batchDownloadRoutePath),
  /** /project/:projectId/audio_recordings/download */
  project: audioRecordingsRoutes.project.add(batchDownloadRoutePath),
};
