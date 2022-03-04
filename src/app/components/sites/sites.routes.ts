import { projectMenuItem } from "@components/projects/projects.menus";

export const sitesRoute = projectMenuItem.route.addFeatureModule("sites");
export const siteRoute = sitesRoute.add(":siteId");
