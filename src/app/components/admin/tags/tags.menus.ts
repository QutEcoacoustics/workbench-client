import { Category, menuRoute } from "@interfaces/menusInterfaces";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
} from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminTagsRoute = adminRoute.addFeatureModule("tags");

export const adminTagsCategory: Category = {
  icon: ["fas", "tag"],
  label: "Tags",
  route: adminTagsRoute,
};

export const adminTagsMenuItem = menuRoute({
  icon: ["fas", "tag"],
  label: "Tags",
  route: adminTagsRoute,
  tooltip: () => "Manage tags",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminNewTagMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New Tag",
  route: adminTagsRoute.add("new"),
  tooltip: () => "Create a new tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate,
});

const adminTagRoute = adminTagsRoute.add(":tagId");

export const adminEditTagMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit Tag",
  route: adminTagRoute.add("edit"),
  tooltip: () => "Edit an existing tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate,
});

export const adminDeleteTagMenuItem = menuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Tag",
  route: adminTagRoute.add("delete"),
  tooltip: () => "Delete an existing tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate,
});
