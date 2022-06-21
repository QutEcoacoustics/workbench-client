import {
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { menuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { newHarvestRoute, harvestsRoute, harvestRoute } from "./harvest.routes";

// TODO #1888 Change isAdminPredicate to isProjectEditorPredicate when finished

export const harvestsCategory = projectCategory;

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
  label: "Upload Recordings",
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
