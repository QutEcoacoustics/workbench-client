import { pointMenuItem } from "@components/sites/points.menus";
import { siteMenuItem } from "@components/sites/sites.menus";
import { Category, menuLink, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

const baseRoutePath = "audio_recordings";
const queryParameters = ({ siteId, regionId, projectId }) => ({
  siteId,
  regionId,
  projectId,
});

export const audioRecordingsRoute = StrongRoute.newRoot().add(
  baseRoutePath,
  queryParameters
);

export const siteAudioRecordingsRoute = siteMenuItem.route.addFeatureModule(
  baseRoutePath,
  queryParameters
);

export const pointAudioRecordingsRoute = pointMenuItem.route.addFeatureModule(
  baseRoutePath,
  queryParameters
);

export const audioRecordingsCategory: Category = {
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  route: audioRecordingsRoute,
};

export const audioRecordingsMenuItem = menuRoute({
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  tooltip: () => "View associated audio recordings",
  route: audioRecordingsRoute,
});

export const siteAudioRecordingsMenuItem = menuRoute({
  ...audioRecordingsMenuItem,
  route: siteAudioRecordingsRoute,
  parent: siteMenuItem,
});

export const pointAudioRecordingsMenuItem = menuRoute({
  ...audioRecordingsMenuItem,
  route: pointAudioRecordingsRoute,
  parent: pointMenuItem,
});

const childRoutePath = ":audioRecordingId";

export const audioRecordingMenuItem = menuRoute({
  icon: ["fas", "file-audio"],
  label: "Audio Recording",
  tooltip: () => "View audio recording details",
  route: audioRecordingsMenuItem.route.add(childRoutePath, queryParameters),
  parent: audioRecordingsMenuItem,
});

export const siteAudioRecordingMenuItem = menuRoute({
  ...audioRecordingMenuItem,
  route: siteAudioRecordingsMenuItem.route.add(childRoutePath, queryParameters),
  parent: siteAudioRecordingsMenuItem,
});

export const pointAudioRecordingMenuItem = menuRoute({
  ...audioRecordingMenuItem,
  route: pointAudioRecordingsMenuItem.route.add(
    childRoutePath,
    queryParameters
  ),
  parent: pointAudioRecordingsMenuItem,
});

export const downloadAudioRecordingMenuItem = menuLink({
  icon: ["fas", "download"],
  label: "Download",
  tooltip: () => "Download audio recording",
  // Relative routes go to api
  uri: ({ audioRecordingId }) =>
    `/audio_recordings/${audioRecordingId}/original`,
});

export const batchDownloadAudioRecordingMenuItem = menuLink({
  disabled: true,
  icon: ["fas", "download"],
  label: "Batch Download",
  tooltip: () =>
    "(UNDER CONSTRUCTION) Download groups of audio recordings in a single batch",
  uri: () => "not_implemented",
});
