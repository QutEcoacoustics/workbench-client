import { menuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminSettingsRoute = adminRoute.addFeatureModule("settings");

export const adminSettingsMenuItem = menuRoute({
  icon: ["fas", "wrench"],
  label: "Client Settings",
  route: adminSettingsRoute,
  tooltip: () => "Manage client settings",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});
