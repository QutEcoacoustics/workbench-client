import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { AbstractModel } from "@models/AbstractModel";
import type { User } from "@models/User";
import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultUserIcon,
  isAdminPredicate,
  isLoggedInPredicate,
} from "src/app/app.menus";

function getUserName(user: AbstractModel) {
  return user ? (user as User).userName : "unknown";
}

export const myAccountRoute = StrongRoute.Base.add("my_account");

/**
 * My Account Menus
 */
export const myAccountCategory: Category = {
  icon: defaultUserIcon,
  label: "My Profile",
  route: myAccountRoute,
};

export const myAccountMenuItem = MenuRoute({
  icon: defaultUserIcon,
  label: "My Profile",
  order: 2,
  predicate: isLoggedInPredicate,
  route: myAccountRoute,
  tooltip: () => "View profile",
});

export const myEditMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit my profile",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("edit"),
  tooltip: () => "Change the details for your profile",
});

export const myPasswordMenuItem = MenuRoute({
  icon: ["fas", "key"],
  label: "Edit my password",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myEditMenuItem.route.add("password"),
  tooltip: () => "Change the password for your profile",
});

export const myDeleteMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Cancel my account",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("delete"),
  tooltip: () => "Remove your account from this website",
});

export const myProjectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "My Projects",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("projects"),
  tooltip: (user) => `Projects ${getUserName(user)} can access`,
});

export const mySitesMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "My Sites",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("sites"),
  tooltip: (user) => `Sites ${getUserName(user)} can access`,
});

export const myBookmarksMenuItem = MenuRoute({
  icon: ["fas", "bookmark"],
  label: "My Bookmarks",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("bookmarks"),
  tooltip: (user) => `Bookmarks created by ${getUserName(user)}`,
});

export const myAnnotationsMenuItem = MenuRoute({
  icon: ["fas", "bullseye"],
  label: "My Annotations",
  order: 3,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("annotations"),
  tooltip: (user) => `Annotations created by ${getUserName(user)}`,
});

/**
 * Their Profile Menus
 */
export const theirProfileRoute = StrongRoute.Base.add("user_accounts").add(
  ":accountId"
);

export const theirProfileCategory: Category = {
  icon: ["fas", "user-circle"],
  label: "Their Profile",
  route: theirProfileRoute,
};

export const theirProfileMenuItem = MenuRoute({
  icon: theirProfileCategory.icon,
  label: "Their Profile",
  order: myAccountMenuItem.order,
  predicate: isLoggedInPredicate,
  route: theirProfileRoute,
  tooltip: () => "View their profile",
});

export const theirEditMenuItem = MenuRoute({
  icon: myEditMenuItem.icon,
  label: "Edit their profile",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this profile",
});

export const theirProjectsMenuItem = MenuRoute({
  icon: myProjectsMenuItem.icon,
  label: "Their Projects",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("projects"),
  tooltip: () => "Projects they can access",
});

export const theirSitesMenuItem = MenuRoute({
  icon: mySitesMenuItem.icon,
  label: "Their Sites",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("sites"),
  tooltip: () => "Sites they can access",
});

export const theirBookmarksMenuItem = MenuRoute({
  icon: myBookmarksMenuItem.icon,
  label: "Their Bookmarks",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("bookmarks"),
  tooltip: () => "Bookmarks created by them",
});

export const theirAnnotationsMenuItem = MenuRoute({
  icon: myAnnotationsMenuItem.icon,
  label: "Their Annotations",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("annotations"),
  tooltip: () => "Annotations created by them",
});
