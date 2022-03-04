import { projectRoute } from "@components/projects/projects.routes";
import { StrongRoute } from "@interfaces/strongRoute";

export const shallowRegionsRoute = StrongRoute.newRoot().add("regions");
export const regionsRoute = projectRoute.addFeatureModule("regions");
export const regionRoute = regionsRoute.add(":regionId");
