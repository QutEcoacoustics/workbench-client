import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { defaultEditIcon, defaultNewIcon, isAdminPredicate } from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminTagGroupsRoute = adminRoute.addFeatureModule("tag_groups");

export const adminTagGroupsCategory: Category = {
  icon: ["fas", "tags"],
  label: "Tag Group",
  route: adminTagGroupsRoute,
};

export const adminTagGroupsMenuItem = menuRoute({
  icon: ["fas", "tags"],
  label: "Tag Group",
  route: adminTagGroupsRoute,
  tooltip: () => "Manage tag groups",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminNewTagGroupMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Tag Group",
  route: adminTagGroupsRoute.add("new"),
  tooltip: () => "Create a new tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate,
});

const adminTagGroupRoute = adminTagGroupsRoute.add(":tagGroupId");

export const adminEditTagGroupMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit Tag Group",
  route: adminTagGroupRoute.add("edit"),
  tooltip: () => "Update an existing tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate,
  title: () => CommonRouteTitles.routeEditTitle,
});
