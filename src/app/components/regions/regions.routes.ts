import { projectRoute } from "@components/projects/projects.routes";
import { StrongRoute } from "@interfaces/strongRoute";

// When "hideProjects" is set in the environment.json, regions are not nested
// under projects (e.g. A2O).
export const shallowRegionsRoute = StrongRoute.newRoot().add("regions");

export const regionsRoute = projectRoute.addFeatureModule("regions");
export const regionRoute = regionsRoute.add(":regionId");
