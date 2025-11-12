import { projectRoute } from "@components/projects/projects.routes";
import { StrongRoute } from "@interfaces/strongRoute";

// This route is accessible through the UI When "hideProjects" is set in the
// environment.json (e.g. A2O).
export const shallowRegionsRoute = StrongRoute.newRoot().add("regions");

export const regionsRoute = projectRoute.addFeatureModule("regions");
export const regionRoute = regionsRoute.add(":regionId");
