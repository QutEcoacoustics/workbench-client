import { Params } from "@angular/router";
import { MenuLink } from "@interfaces/menusInterfaces";
import { stringTemplate } from "../stringTemplate/stringTemplate";

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

export const analysisJobMenuItem = MenuLink({
  icon: ["fas", "exclamation-triangle"],
  label: "Analysis Job Details",
  uri: () => "/fix_me",
  tooltip: () => "View analysis job",
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
