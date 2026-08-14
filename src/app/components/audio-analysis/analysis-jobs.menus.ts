import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { projectMenuItem } from "@components/projects/projects.menus";
import { AnalysisJob } from "@models/AnalysisJob";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { RouterStateSnapshot } from "@angular/router";
import { analysesRoute, analysisJobRoute } from "./analysis-jobs.routes";

export const analysisCategory = {
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: analysisJobRoute,
} satisfies Category;

export const analysesMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  tooltip: () => "View audio analysis jobs",
  order: 5,
  parent: projectMenuItem,
  route: analysesRoute,
});

export const analysisJobMenuItem = menuRoute({
  icon: ["fas", "tasks"],
  label: "Analysis Job",
  tooltip: () => "View audio analysis job",
  route: analysisJobRoute,
  parent: analysesMenuItem,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, AnalysisJob)?.name,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild!.data;
    return componentModel.analysisJob.model?.name;
  },
});
