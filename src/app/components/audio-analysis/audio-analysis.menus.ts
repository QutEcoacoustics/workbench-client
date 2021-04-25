import { Category, menuAction, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { defaultDeleteIcon, defaultNewIcon } from "src/app/app.menus";

export const audioAnalysesRoute = StrongRoute.newRoot().add("audio_analysis");

export const audioAnalysisCategory: Category = {
  icon: ["fas", "server"],
  label: "Audio Analysis",
  route: audioAnalysesRoute,
};

export const audioAnalysesMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Audio Analysis",
  tooltip: () => "View audio analysis jobs",
  order: 5,
  route: audioAnalysesRoute,
});

export const newAudioAnalysisMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Analysis Job",
  tooltip: () => "Create a custom analysis job",
  route: audioAnalysesRoute.add("new"),
  parent: audioAnalysesMenuItem,
});

export const audioAnalysisRoute = audioAnalysesRoute.add(":analysisJobId");

export const audioAnalysisMenuItem = menuRoute({
  icon: ["fas", "tasks"],
  label: "Analysis Job",
  tooltip: () => "View audio analysis job",
  route: audioAnalysisRoute,
  parent: audioAnalysesMenuItem,
});

export const audioAnalysisResultsMenuItem = menuRoute({
  icon: ["fas", "table"],
  label: "Results",
  tooltip: () => "View results for this analysis job",
  route: audioAnalysisRoute.add("results"),
  parent: audioAnalysisMenuItem,
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
