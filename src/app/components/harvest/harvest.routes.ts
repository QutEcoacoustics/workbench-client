import { projectRoute } from "@components/projects/projects.routes";

export const harvestsRoute = projectRoute.addFeatureModule("uploads");
export const harvestRoute = harvestsRoute.add(":harvestId");
export const newHarvestRoute = harvestsRoute.add("new");
