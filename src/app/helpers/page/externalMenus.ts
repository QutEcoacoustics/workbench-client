import { Params } from "@angular/router";
import { menuLink } from "@interfaces/menusInterfaces";
import { stringTemplate } from "../stringTemplate/stringTemplate";

export const libraryMenuItem = menuLink({
  icon: ["fas", "book"],
  label: "Library",
  tooltip: () => "Annotation library",
  order: 6,
  uri: () => "/library",
});

export const exploreAudioMenuItem = menuLink({
  uri: (params) => visualizeUri(params),
  icon: ["fas", "map"],
  label: "Explore audio",
  tooltip: () => "Explore audio",
});

export const analysisJobMenuItem = menuLink({
  icon: ["fas", "exclamation-triangle"],
  label: "Analysis Job Details",
  uri: () => "/fix_me",
  tooltip: () => "View analysis job",
});

export const tagMenuItem = menuLink({
  icon: ["fas", "exclamation-triangle"],
  label: "Tag (NOT IMPLEMENTED)",
  tooltip: () => "Tag (NOT IMPLEMENTED)",
  uri: () => "/broken_link",
});

function ids(params: Params): string {
  if (!params) {
    return "";
  }

  const siteId = params.siteId;
  if (siteId) {
    return `siteId=${siteId}`;
  }

  const projectId = params.projectId;
  if (projectId) {
    return `projectId=${projectId}`;
  }

  return "";
}

const visualizeUri = stringTemplate`/visualize?${ids}`;
