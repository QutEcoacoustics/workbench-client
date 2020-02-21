import {
  defaultEditIcon,
  isAdminPredicate,
  isLoggedInPredicate
} from "src/app/app.menus";
import {
  Category,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const myAccountRoute = StrongRoute.Base.add("my_account");

/**
 * My Account Menus
 */
export const myAccountCategory: Category = {
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute
};

export const myAccountMenuItem = MenuRoute({
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute,
  tooltip: () => "View profile",
  predicate: isLoggedInPredicate,
  order: 2
});

export const editMyAccountMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit my profile",
  route: myAccountMenuItem.route.add("edit"),
  parent: myAccountMenuItem,
  tooltip: () => "Change the details for your profile",
  predicate: isLoggedInPredicate
});

export const myProjectsMenuItem = MenuLink({
  icon: ["fas", "globe-asia"],
  label: "My Projects",
  uri: () => "BROKEN LINK",
  tooltip: user => `Projects ${user.userName} can access`,
  predicate: user => !!user
});

export const mySitesMenuItem = MenuLink({
  icon: ["fas", "map-marker-alt"],
  label: "My Sites",
  uri: () => "BROKEN LINK",
  tooltip: user => `Sites ${user.userName} can access`,
  predicate: user => !!user
});

export const myBookmarksMenuItem = MenuLink({
  icon: ["fas", "bookmark"],
  label: "My Bookmarks",
  uri: () => "BROKEN LINK",
  tooltip: user => `Bookmarks created by ${user.userName}`,
  predicate: user => !!user
});

export const myAnnotationsMenuItem = MenuLink({
  icon: ["fas", "border-all"],
  label: "My Annotations",
  tooltip: user => `Annotations created by ${user.userName}`,
  predicate: user => !!user,
  order: 3,
  uri: () => "REPLACE_ME"
});

/**
 * Their Profile Menus
 */
export const theirProfileRoute = StrongRoute.Base.add("user_accounts");

export const theirProfileCategory: Category = {
  icon: myAccountCategory.icon,
  label: "Their Profile",
  route: theirProfileRoute
};

export const theirProfileMenuItem = MenuRoute({
  icon: myAccountMenuItem.icon,
  label: "Their Profile",
  route: theirProfileRoute.add(":userId"),
  tooltip: () => "View their profile",
  predicate: isLoggedInPredicate,
  order: myAccountMenuItem.order
});

export const theirEditProfileMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit their profile",
  route: theirProfileMenuItem.route.add("edit"),
  parent: theirProfileMenuItem,
  tooltip: () => "Change the details for this profile",
  predicate: isAdminPredicate
});

export const theirProjectsMenuItem = MenuLink({
  icon: ["fas", "globe-asia"],
  label: "Their Projects",
  uri: () => "BROKEN LINK",
  tooltip: () => "Projects they can access",
  predicate: user => !!user
});

export const theirSitesMenuItem = MenuLink({
  icon: ["fas", "map-marker-alt"],
  label: "Their Sites",
  uri: () => "BROKEN LINK",
  tooltip: () => "Sites they can access",
  predicate: user => !!user
});

export const theirBookmarksMenuItem = MenuLink({
  icon: ["fas", "bookmark"],
  label: "Their Bookmarks",
  uri: () => "BROKEN LINK",
  tooltip: () => "Bookmarks created by them",
  predicate: user => !!user
});

export const theirAnnotationsMenuItem = MenuLink({
  icon: ["fas", "bullseye"],
  label: "Their Annotations",
  uri: () => "BROKEN LINK",
  tooltip: () => "Annotations created by them",
  predicate: user => !!user
});
