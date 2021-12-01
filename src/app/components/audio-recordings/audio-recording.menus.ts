import { audioRecordingOriginalEndpoint } from "@baw-api/audio-recording/audio-recordings.service";
import {
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import {
  regionMenuItem,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
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

export const audioRecordingsRoutes = {
  base: StrongRoute.newRoot().add(baseRoutePath),
  site: makeRoute(siteMenuItem),
  point: makeRoute(pointMenuItem),
  region: makeRoute(regionMenuItem),
  regions: makeRoute(shallowRegionsMenuItem),
  project: makeRoute(projectMenuItem),
  projects: makeRoute(projectsMenuItem),
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

export const audioRecordingMenuItems = {
  list: {
    base: makeListMenuItem(audioRecordingsRoutes.base),
    site: makeListMenuItem(audioRecordingsRoutes.site, siteMenuItem),
    point: makeListMenuItem(audioRecordingsRoutes.point, pointMenuItem),
    region: makeListMenuItem(audioRecordingsRoutes.region, regionMenuItem),
    regions: makeListMenuItem(
      audioRecordingsRoutes.regions,
      shallowRegionsMenuItem
    ),
    project: makeListMenuItem(audioRecordingsRoutes.project, projectMenuItem),
    projects: makeListMenuItem(
      audioRecordingsRoutes.projects,
      projectsMenuItem
    ),
  },
  details: {
    base: makeDetailsMenuItem(audioRecordingsRoutes.base),
    site: makeDetailsMenuItem(audioRecordingsRoutes.site, siteMenuItem),
    point: makeDetailsMenuItem(audioRecordingsRoutes.point, pointMenuItem),
    region: makeDetailsMenuItem(audioRecordingsRoutes.region, regionMenuItem),
    regions: makeDetailsMenuItem(
      audioRecordingsRoutes.regions,
      shallowRegionsMenuItem
    ),
    project: makeDetailsMenuItem(
      audioRecordingsRoutes.project,
      projectMenuItem
    ),
    projects: makeDetailsMenuItem(
      audioRecordingsRoutes.projects,
      projectsMenuItem
    ),
  },
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
