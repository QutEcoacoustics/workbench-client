import { regionRoute } from "@components/regions/regions.routes";

export const pointsRoute = regionRoute.addFeatureModule("points");
export const pointRoute = pointsRoute.add(":siteId");
