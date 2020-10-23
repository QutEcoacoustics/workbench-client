import { Category, MenuLink, MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  defaultEditIcon,
  defaultUserIcon,
  isAdminPredicate,
  isLoggedInPredicate,
} from "src/app/app.menus";

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

export const myProjectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "My Projects",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("projects"),
  tooltip: (user) => `Projects ${user.userName} can access`,
});

export const mySitesMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "My Sites",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("sites"),
  tooltip: (user) => `Sites ${user.userName} can access`,
});

export const myBookmarksMenuItem = MenuRoute({
  icon: ["fas", "bookmark"],
  label: "My Bookmarks",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("bookmarks"),
  tooltip: (user) => `Bookmarks created by ${user.userName}`,
});

export const myAnnotationsMenuItem = MenuRoute({
  icon: ["fas", "border-all"],
  label: "My Annotations",
  order: 3,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("annotations"),
  tooltip: (user) => `Annotations created by ${user.userName}`,
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
  icon: defaultEditIcon,
  label: "Edit their profile",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this profile",
});

export const theirProjectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "Their Projects",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("projects"),
  tooltip: () => "Projects they can access",
});

export const theirSitesMenuItem = MenuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Their Sites",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("sites"),
  tooltip: () => "Sites they can access",
});

export const theirBookmarksMenuItem = MenuRoute({
  icon: ["fas", "bookmark"],
  label: "Their Bookmarks",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("bookmarks"),
  tooltip: () => "Bookmarks created by them",
});

export const theirAnnotationsMenuItem = MenuRoute({
  icon: ["fas", "bullseye"],
  label: "Their Annotations",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("annotations"),
  tooltip: () => "Annotations created by them",
});
