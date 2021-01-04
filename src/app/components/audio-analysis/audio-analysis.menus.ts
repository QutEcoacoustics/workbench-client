import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { defaultNewIcon } from "src/app/app.menus";

export const audioAnalysisRoute = StrongRoute.base.add("audio_analysis");

export const audioAnalysisCategory: Category = {
  icon: ["fas", "server"],
  label: "Audio Analysis",
  route: audioAnalysisRoute,
};

export const audioAnalysisMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Audio Analysis",
  tooltip: () => "View audio analysis jobs",
  order: 5,
  route: audioAnalysisRoute,
});

export const newAudioAnalysisMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Analysis Job",
  tooltip: () => "Create a custom analysis job",
  route: audioAnalysisRoute.add("new"),
});
