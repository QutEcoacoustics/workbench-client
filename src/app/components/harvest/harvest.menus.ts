import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { projectMenuItem } from "@components/projects/projects.menus";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { harvestRoute, harvestsRoute, newHarvestRoute } from "./harvest.routes";

export const createHarvestPredicate = (_: any, data: IPageInfo): boolean => {
  const project = retrieveResolvedModel(data, Project);
  // TODO Use project.can("createHarvest")
  return true;
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
  predicate: createHarvestPredicate,
  route: harvestsRoute,
  tooltip: () => "(BETA) View bulk uploads for this project",
});

export const newHarvestMenuItem = menuRoute({
  icon: ["fas", "cloud-arrow-up"],
  label: "New Upload",
  parent: harvestsMenuItem,
  predicate: createHarvestPredicate,
  route: newHarvestRoute,
  tooltip: () => "(BETA) Upload new audio to this project",
});

export const harvestMenuItem = menuRoute({
  ...newHarvestMenuItem,
  icon: ["fas", "cloud-arrow-up"],
  route: harvestRoute,
});
