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
  menuRoute
} from "@interfaces/menusInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import {
  audioRecordingBatchRoutes, audioRecordingRoutes, audioRecordingsRoutes
} from "./audio-recording.routes";

type RecordingRoutes = "base" | "site" | "siteAndRegion" | "region" | "project";

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
    route: audioRecordingRoutes[subRoute],
    parent: listMenuItems[subRoute],
    // TODO #346 Show local date time of recording date using timezone where sensor was. Should show timezone on highlight?
    breadcrumbResolve: (pageInfo) =>
      retrieveResolvedModel(pageInfo, AudioRecording)?.id.toFixed(0),
  });
}

function makeBatchMenuItem(subRoute: RecordingRoutes): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-download"],
    label: "Batch Download Audio Recordings",
    tooltip: () => "Download multiple audio recordings",
    // TODO Create base route in future
    disabled: subRoute === "base",
    route: audioRecordingBatchRoutes[subRoute],
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
