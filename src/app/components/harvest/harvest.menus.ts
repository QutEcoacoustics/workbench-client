import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { projectMenuItem } from "@components/projects/projects.menus";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { isProjectEditorPredicate } from "src/app/app.menus";
import { harvestRoute, harvestsRoute, newHarvestRoute } from "./harvest.routes";

export const createHarvestPredicate = (_: any, data: IPageInfo): boolean => {
  const project = retrieveResolvedModel(data, Project);
  return project?.can("createHarvest").can;
};

export const harvestsCategory: Category = {
  icon: ["fas", "cloud"],
  label: "Recording Uploads",
  route: harvestsRoute,
};

export const harvestsMenuItem = menuRoute({
  icon: ["fas", "cloud"],
  label: "Recording Uploads",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: harvestsRoute,
  tooltip: () => "(BETA) View bulk uploads for this project",
});

export const newHarvestMenuItem = menuRoute({
  icon: ["fas", "cloud-arrow-up"],
  label: "New Upload",
  parent: harvestsMenuItem,
  predicate: createHarvestPredicate,
  route: newHarvestRoute,
  primaryBackground: true,
  tooltip: () => "(BETA) Upload new audio to this project",
});

export const harvestMenuItem = menuRoute({
  ...newHarvestMenuItem,
  icon: ["fas", "cloud-arrow-up"],
  route: harvestRoute,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel.harvest.model?.name;
  },
});
