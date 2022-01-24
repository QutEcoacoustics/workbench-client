import { audioRecordingOriginalEndpoint } from "@baw-api/audio-recording/audio-recordings.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { siteMenuItem } from "@components/sites/sites.menus";
import {
  Category,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

const listRoutePath = "audio_recordings";
const showRoutePath = ":audioRecordingId";
const batchDownloadRoutePath = "download";

type RecordingRoutes = "base" | "site" | "siteAndRegion" | "region" | "project";

// Create audio recording base route, and sub routes
export const audioRecordingsRoutes: Record<RecordingRoutes, StrongRoute> = {
  /** /audio_recordings */
  base: StrongRoute.newRoot().add(listRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings */
  site: siteMenuItem.route.addFeatureModule(listRoutePath),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings */
  siteAndRegion: pointMenuItem.route.addFeatureModule(listRoutePath),
  /** /project/:projectId/region/:regionId/audio_recordings */
  region: regionMenuItem.route.addFeatureModule(listRoutePath),
  /** /project/:projectId/audio_recordings */
  project: projectMenuItem.route.addFeatureModule(listRoutePath),
};

export const audioRecordingsCategory: Category = {
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  route: audioRecordingsRoutes.base,
};

function makeListMenuItem(
  subRoute: RecordingRoutes,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-archive"],
    label: "Audio Recordings",
    tooltip: () => "View associated audio recordings",
    route: audioRecordingsRoutes[subRoute],
    parent,
  });
}

function makeDetailsMenuItem(subRoute: RecordingRoutes): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-audio"],
    label: "Audio Recording",
    tooltip: () => "View audio recording details",
    route: audioRecordingsRoutes[subRoute].add(showRoutePath),
    parent: listMenuItems[subRoute],
  });
}

function makeBatchMenuItem(subRoute: RecordingRoutes): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-download"],
    label: "Batch Download Audio Recordings",
    tooltip: () => "Download multiple audio recordings",
    // TODO Create base route in future
    disabled: subRoute === "base",
    route: audioRecordingsRoutes[subRoute].add(batchDownloadRoutePath),
    parent: listMenuItems[subRoute],
  });
}

const listMenuItems: Record<RecordingRoutes, MenuRoute> = {
  /** /audio_recordings */
  base: makeListMenuItem("base"),
  /** /project/:projectId/site/:siteId/audio_recordings */
  site: makeListMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings */
  siteAndRegion: makeListMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/audio_recordings */
  region: makeListMenuItem("region", regionMenuItem),
  /** /project/:projectId/audio_recordings */
  project: makeListMenuItem("project", projectMenuItem),
};

const detailsMenuItems: Record<RecordingRoutes, MenuRoute> = {
  /** /audio_recordings */
  base: makeDetailsMenuItem("base"),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId */
  site: makeDetailsMenuItem("site"),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId */
  siteAndRegion: makeDetailsMenuItem("siteAndRegion"),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId */
  region: makeDetailsMenuItem("region"),
  /** /project/:projectId/audio_recordings/:audioRecordingId */
  project: makeDetailsMenuItem("project"),
};

const batchMenuItems: Record<RecordingRoutes, MenuRoute> = {
  /** /audio_recordings/download */
  base: makeBatchMenuItem("base"),
  /** /project/:projectId/site/:siteId/audio_recordings/download */
  site: makeBatchMenuItem("site"),
  /** /project/:projectId/region/:regionId/point/:pointId/audio_recordings/download */
  siteAndRegion: makeBatchMenuItem("siteAndRegion"),
  /** /region/:regionId/audio_recordings/download */
  region: makeBatchMenuItem("region"),
  /** /project/:projectId/audio_recordings/download */
  project: makeBatchMenuItem("project"),
};

export const audioRecordingMenuItems = {
  list: listMenuItems,
  details: detailsMenuItems,
  batch: batchMenuItems,
};

export const downloadAudioRecordingMenuItem = menuLink({
  icon: ["fas", "download"],
  label: "Download",
  tooltip: () => "Download audio recording",
  // Relative routes go to api
  uri: ({ audioRecordingId }) =>
    audioRecordingOriginalEndpoint(audioRecordingId),
});
