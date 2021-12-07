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

const baseRoutePath = "audio_recordings";
const childRoutePath = ":audioRecordingId";

function makeRoute(menuItem: MenuRoute): StrongRoute {
  return menuItem.route.addFeatureModule(baseRoutePath);
}

// Create audio recording base route, and sub routes
export const audioRecordingsRoutes = {
  /** /audio_recordings */
  base: StrongRoute.newRoot().add(baseRoutePath),
  /** /project/:projectId/site/:siteId/audio_recordings */
  site: makeRoute(siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings */
  point: makeRoute(pointMenuItem),
  /** /project/:projectId/region/:regionId/audio_recordings */
  region: makeRoute(regionMenuItem),
  /** /project/:projectId/audio_recordings */
  project: makeRoute(projectMenuItem),
};

export const audioRecordingsCategory: Category = {
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  route: audioRecordingsRoutes.base,
};

function makeListMenuItem(route: StrongRoute, parent?: MenuRoute): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-archive"],
    label: "Audio Recordings",
    tooltip: () => "View associated audio recordings",
    route,
    parent,
  });
}

function makeDetailsMenuItem(
  route: StrongRoute,
  parent?: MenuRoute
): MenuRoute {
  return menuRoute({
    icon: ["fas", "file-audio"],
    label: "Audio Recording",
    tooltip: () => "View audio recording details",
    route: route.add(childRoutePath),
    parent,
  });
}

const listMenuItems = {
  /** /audio_recordings */
  base: makeListMenuItem(audioRecordingsRoutes.base),
  /** /project/:projectId/site/:siteId/audio_recordings */
  site: makeListMenuItem(audioRecordingsRoutes.site, siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings */
  point: makeListMenuItem(audioRecordingsRoutes.point, pointMenuItem),
  /** /project/:projectId/region/:regionId/audio_recordings */
  region: makeListMenuItem(audioRecordingsRoutes.region, regionMenuItem),
  /** /project/:projectId/audio_recordings */
  project: makeListMenuItem(audioRecordingsRoutes.project, projectMenuItem),
};

const detailsMenuItems = {
  /** /audio_recordings */
  base: makeDetailsMenuItem(audioRecordingsRoutes.base, listMenuItems.base),
  /** /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId */
  site: makeDetailsMenuItem(audioRecordingsRoutes.site, listMenuItems.site),
  /** /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId */
  point: makeDetailsMenuItem(audioRecordingsRoutes.point, listMenuItems.point),
  /** /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId */
  region: makeDetailsMenuItem(
    audioRecordingsRoutes.region,
    listMenuItems.region
  ),
  /** /project/:projectId/audio_recordings/:audioRecordingId */
  project: makeDetailsMenuItem(
    audioRecordingsRoutes.project,
    listMenuItems.project
  ),
};

export const audioRecordingMenuItems = {
  list: listMenuItems,
  details: detailsMenuItems,
};

export const downloadAudioRecordingMenuItem = menuLink({
  icon: ["fas", "download"],
  label: "Download",
  tooltip: () => "Download audio recording",
  // Relative routes go to api
  uri: ({ audioRecordingId }) =>
    audioRecordingOriginalEndpoint(audioRecordingId),
});

export const batchDownloadAudioRecordingMenuItem = menuLink({
  disabled: true,
  icon: ["fas", "download"],
  label: "Batch Download",
  tooltip: () => "(UNDER CONSTRUCTION) Download multiple audio recordings",
  uri: () => "not_implemented",
});
