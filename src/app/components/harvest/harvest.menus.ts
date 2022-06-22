import { projectMenuItem } from "@components/projects/projects.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { harvestRoute, harvestsRoute, newHarvestRoute } from "./harvest.routes";

// TODO #1888 Change isAdminPredicate to isProjectEditorPredicate when finished

export const harvestsCategory: Category = {
  icon: ["fas", "cloud"],
  label: "Recording Uploads",
  route: harvestsRoute,
};

export const harvestsMenuItem = menuRoute({
  icon: ["fas", "cloud"],
  label: "Recording Uploads",
  parent: projectMenuItem,
  predicate: isAdminPredicate,
  route: harvestsRoute,
  tooltip: () => "(UNDER DEVELOPMENT) View bulk uploads for this project",
});

export const newHarvestMenuItem = menuRoute({
  icon: ["fas", "upload"],
  label: "Upload",
  parent: harvestsMenuItem,
  predicate: isAdminPredicate,
  route: newHarvestRoute,
  tooltip: () => "(UNDER DEVELOPMENT) Upload new audio to this project",
});

export const harvestMenuItem = menuRoute({
  ...newHarvestMenuItem,
  icon: ["fas", "cloud-arrow-up"],
  route: harvestRoute,
});
