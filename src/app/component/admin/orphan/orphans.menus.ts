import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminOrphansRoute = adminRoute.addFeatureModule("orphans");

export const adminOrphansCategory: Category = {
  icon: ["fas", "map-marked-alt"],
  label: "Orphan Sites",
  route: adminOrphansRoute,
};

export const adminOrphansMenuItem = MenuRoute({
  icon: adminOrphansCategory.icon,
  label: "Orphan Sites",
  route: adminOrphansCategory.route,
  tooltip: () => "Manage orphaned sites",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminOrphanMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Orphan Site",
  route: adminOrphansMenuItem.route.add(":siteId"),
  tooltip: () => "Manage orphaned site",
  parent: adminOrphansMenuItem,
  predicate: isAdminPredicate,
});
