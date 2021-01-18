import { Params } from "@angular/router";
import { menuLink } from "@interfaces/menusInterfaces";
import { stringTemplate } from "../stringTemplate/stringTemplate";

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
