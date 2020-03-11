import {
  defaultEditIcon,
  defaultUserIcon,
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
  icon: defaultUserIcon,
  label: "My Profile",
  route: myAccountRoute,
  resolvers: {
    user: "UserShowResolver"
  }
};

export const myAccountMenuItem = MenuRoute({
  icon: defaultUserIcon,
  label: "My Profile",
  order: 2,
  predicate: isLoggedInPredicate,
  route: myAccountRoute,
  tooltip: () => "View profile"
});

export const editMyAccountMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit my profile",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("edit"),
  tooltip: () => "Change the details for your profile"
});

export const myProjectsMenuItem = MenuLink({
  icon: ["fas", "globe-asia"],
  label: "My Projects",
  predicate: user => !!user,
  tooltip: user => `Projects ${user.userName} can access`,
  uri: () => "BROKEN LINK"
});

export const mySitesMenuItem = MenuLink({
  icon: ["fas", "map-marker-alt"],
  label: "My Sites",
  predicate: user => !!user,
  tooltip: user => `Sites ${user.userName} can access`,
  uri: () => "BROKEN LINK"
});

export const myBookmarksMenuItem = MenuLink({
  icon: ["fas", "bookmark"],
  label: "My Bookmarks",
  predicate: user => !!user,
  tooltip: user => `Bookmarks created by ${user.userName}`,
  uri: () => "BROKEN LINK"
});

export const myAnnotationsMenuItem = MenuLink({
  icon: ["fas", "border-all"],
  label: "My Annotations",
  order: 3,
  predicate: user => !!user,
  tooltip: user => `Annotations created by ${user.userName}`,
  uri: () => "REPLACE_ME"
});

/**
 * Their Profile Menus
 */
export const theirProfileRoute = StrongRoute.Base.add("user_accounts").add(
  ":accountId"
);

export const theirProfileCategory: Category = {
  icon: myAccountCategory.icon,
  label: "Their Profile",
  route: theirProfileRoute,
  resolvers: {
    account: "AccountShowResolver"
  }
};

export const theirProfileMenuItem = MenuRoute({
  icon: myAccountMenuItem.icon,
  label: "Their Profile",
  order: myAccountMenuItem.order,
  predicate: isLoggedInPredicate,
  route: theirProfileRoute,
  tooltip: () => "View their profile"
});

export const theirEditProfileMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit their profile",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this profile"
});

export const theirProjectsMenuItem = MenuLink({
  icon: ["fas", "globe-asia"],
  label: "Their Projects",
  predicate: user => !!user,
  tooltip: () => "Projects they can access",
  uri: () => "BROKEN LINK"
});

export const theirSitesMenuItem = MenuLink({
  icon: ["fas", "map-marker-alt"],
  label: "Their Sites",
  predicate: user => !!user,
  tooltip: () => "Sites they can access",
  uri: () => "BROKEN LINK"
});

export const theirBookmarksMenuItem = MenuLink({
  icon: ["fas", "bookmark"],
  label: "Their Bookmarks",
  predicate: user => !!user,
  tooltip: () => "Bookmarks created by them",
  uri: () => "BROKEN LINK"
});

export const theirAnnotationsMenuItem = MenuLink({
  icon: ["fas", "bullseye"],
  label: "Their Annotations",
  predicate: user => !!user,
  tooltip: () => "Annotations created by them",
  uri: () => "BROKEN LINK"
});
