import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Category, menuAction, menuRoute } from "@interfaces/menusInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { defaultDeleteIcon, defaultNewIcon, isAdminPredicate, isWorkInProgressPredicate } from "src/app/app.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { audioAnalysisJobRoute, audioAnalysesRoute } from "./audio-analysis.routes";

export const audioAnalysisCategory = {
  icon: ["fas", "server"],
  label: "Audio Analysis",
  route: audioAnalysisJobRoute,
} satisfies Category;

export const audioAnalysesMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Audio Analysis",
  tooltip: () => "View audio analysis jobs",
  order: 5,
  parent: projectMenuItem,
  route: audioAnalysesRoute,
});

export const newAudioAnalysisJobMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Analysis Job",
  tooltip: () => "Create a custom analysis job",
  route: audioAnalysesRoute.add("new"),
  parent: audioAnalysesMenuItem,
  primaryBackground: true,

  // TODO: I have hidden the new analysis job menu item behind the isAdmin
  // predicate because it is not currently functional
  predicate: isAdminPredicate,
});

export const audioAnalysisMenuJobItem = menuRoute({
  icon: ["fas", "tasks"],
  label: "Analysis Job",
  tooltip: () => "View audio analysis job",
  route: audioAnalysisJobRoute,
  parent: audioAnalysesMenuItem,
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, AnalysisJob)?.name,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel.analysisJob.model.name;
  },
});

export const audioAnalysisJobResultsMenuItem = menuRoute({
  icon: ["fas", "table"],
  label: "Results",
  tooltip: () => "View results for this analysis job",
  route: audioAnalysisJobRoute.add("results"),
  parent: audioAnalysisMenuJobItem,
});

export const retryFailedItemsMenuItem = menuAction({
  icon: ["fas", "redo"],
  label: "Retry failed items",
  tooltip: () => "Retry any failed analysis job items",
  disabled: "BETA: Feature is still being developed.",
  action: () => {},
});

export const pauseProcessingMenuItem = menuAction({
  icon: ["fas", "pause-circle"],
  label: "Pause processing",
  tooltip: () => "Pause all analysis job processing",
  disabled: "BETA: Feature is still being developed.",
  action: () => {},
});

export const deleteAudioAnalysisMenuItem = menuAction({
  icon: defaultDeleteIcon,
  label: "Delete this job",
  tooltip: () => "Delete this analysis job",
  disabled: "BETA: Feature is still being developed.",
  action: () => {},
});

export const downloadAudioAnalysisResultsMenuItem = menuAction({
  icon: ["fas", "file-archive"],
  label: "Download analysis results",
  tooltip: () => "Download a folder containing the analysis results",
  disabled: "BETA: Feature is still being developed.",
  action: () => {},
});
