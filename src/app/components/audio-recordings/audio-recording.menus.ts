import { audioRecordingOriginalEndpoint } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
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
import { AudioRecording } from "@models/AudioRecording";
import {
  audioRecordingBatchRoutes,
  audioRecordingResultsRoutes,
  audioRecordingRoutes,
  audioRecordingsRoutes,
  RecordingRoute,
} from "./audio-recording.routes";

export type RecordingMenuRoutes = Record<RecordingRoute, MenuRoute>;

export const audioRecordingsCategory: Category = {
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  route: audioRecordingsRoutes.base,
};

function makeListMenuItem(
  subRoute: RecordingRoute,
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

function makeDetailsMenuItem(subRoute: RecordingRoute): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-audio"],
    label: "Audio Recording",
    tooltip: () => "View audio recording details",
    route: audioRecordingRoutes[subRoute],
    parent: listMenuItems[subRoute],
    // TODO #346 Show local date time of recording date using timezone where sensor was. Should show timezone on highlight?
    breadcrumbResolve: (pageInfo) =>
      retrieveResolvedModel(pageInfo, AudioRecording)?.id.toFixed(0),
  });
}

function makeBatchMenuItem(subRoute: RecordingRoute): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-download"],
    label: "Download Recordings",
    tooltip: () => "Download multiple audio recordings",
    // TODO Create base route in future
    disabled: subRoute === "base",
    route: audioRecordingBatchRoutes[subRoute],
    parent: listMenuItems[subRoute],
  });
}

export function makeAnalysesMenuItem(subRoute: RecordingRoute): MenuRoute {
  return menuRoute({
    icon: ["fas", "folder-tree"],
    label: "Download analysis results",
    tooltip: () => "Download analysis results",
    route: audioRecordingResultsRoutes[subRoute],
    parent: listMenuItems[subRoute],
    breadcrumbResolve: (pageInfo) =>
      retrieveResolvedModel(pageInfo, AudioRecording)?.id.toFixed(0),
  });
}

const listMenuItems: RecordingMenuRoutes = {
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

const detailsMenuItems: RecordingMenuRoutes = {
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

const batchMenuItems: RecordingMenuRoutes = {
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

const analysesMenuItems: RecordingMenuRoutes = {
  /** /audio_recordings/download */
  base: makeAnalysesMenuItem("base"),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId/results */
  site: makeAnalysesMenuItem("site"),
  /** /project/:projectId/region/:regionId/point/:pointId/audio_recordings/:audioRecordingId/results */
  siteAndRegion: makeAnalysesMenuItem("siteAndRegion"),
  /** /region/:regionId/audio_recordings/:audioRecordingId/results */
  region: makeAnalysesMenuItem("region"),
  /** /project/:projectId/audio_recordings/:audioRecordingId/results */
  project: makeAnalysesMenuItem("project"),
};

export const audioRecordingMenuItems = {
  list: listMenuItems,
  details: detailsMenuItems,
  batch: batchMenuItems,
  analyses: analysesMenuItems,
};

export const downloadAudioRecordingMenuItem = menuLink({
  icon: ["fas", "download"],
  label: "Download",
  tooltip: () => "Download audio recording",
  // Relative routes go to api
  uri: ({ audioRecordingId }) =>
    audioRecordingOriginalEndpoint(audioRecordingId),
});
