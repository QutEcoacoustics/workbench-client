import { Params } from "@angular/router";
import { isLoggedInPredicate } from "src/app/app.menus";
import { MenuLink } from "src/app/interfaces/menusInterfaces";
import { stringTemplate } from "../stringTemplate/stringTemplate";

export const annotationsMenuItem = MenuLink({
  icon: ["fas", "border-all"],
  label: "Annotations",
  predicate: isLoggedInPredicate,
  tooltip: () => "View my recent annotations",
  order: 3,
  uri: () => "/annotations",
});

export const audioAnalysisMenuItem = MenuLink({
  icon: ["fas", "server"],
  label: "Audio Analysis",
  tooltip: () => "View audio analysis jobs",
  order: 5,
  uri: () => "/audio_analysis",
});

export const libraryMenuItem = MenuLink({
  icon: ["fas", "book"],
  label: "Library",
  tooltip: () => "Annotation library",
  order: 6,
  uri: () => "/library",
});

export const exploreAudioMenuItem = MenuLink({
  uri: (params) => visualizeUri(params),
  icon: ["fas", "map"],
  label: "Explore audio",
  tooltip: () => "Explore audio",
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
