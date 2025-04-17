import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolvers/resolver-common";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { AbstractModel } from "@models/AbstractModel";
import { User } from "@models/User";
import {
  defaultEditIcon,
  defaultUserIcon,
  isAdminPredicate,
  isLoggedInPredicate,
} from "src/app/app.menus";

function getUserName(user: AbstractModel) {
  return user ? (user as User).userName : "unknown";
}

export const myAccountRoute = StrongRoute.newRoot().add("my_account");

/**
 * My Account Menus
 */
export const myAccountCategory: Category = {
  icon: defaultUserIcon,
  label: "My Profile",
  route: myAccountRoute,
};

export const myAccountMenuItem = menuRoute({
  icon: defaultUserIcon,
  label: "My Profile",
  order: 2,
  predicate: isLoggedInPredicate,
  route: myAccountRoute,
  tooltip: () => "View profile",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, User)?.userName,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;

    // when viewing another persons profile, the route model will be under the
    // "account" key. However, when viewing "my profile", the key will be "user"
    const accountModel = componentModel.account ?? componentModel.user;
    return `${accountModel.model.userName}'s Profile`;
  },
});

export const myEditMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit my profile",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("edit"),
  tooltip: () => "Change the details for your profile",
  disabled: "BETA: Will be available soon.",
});

export const myPasswordMenuItem = menuRoute({
  icon: ["fas", "key"],
  label: "Edit my password",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myEditMenuItem.route.add("password"),
  tooltip: () => "Change the password for your profile",
  disabled: "BETA: Will be available soon.",
});

export const myProjectsMenuItem = menuRoute({
  icon: ["fas", "globe-asia"],
  label: "My Projects",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("projects"),
  tooltip: (user) => `Projects ${getUserName(user)} can access`,
  title: () => "Projects",
});

export const mySitesMenuItem = menuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "My Sites",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("sites"),
  tooltip: (user) => `Sites ${getUserName(user)} can access`,
  title: () => "Sites",
});

export const myBookmarksMenuItem = menuRoute({
  icon: ["fas", "bookmark"],
  label: "My Bookmarks",
  parent: myAccountMenuItem,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("bookmarks"),
  tooltip: (user) => `Bookmarks created by ${getUserName(user)}`,
  title: () => "Bookmarks",
});

export const myAnnotationsMenuItem = menuRoute({
  icon: ["fas", "bullseye"],
  label: "My Annotations",
  order: 3,
  predicate: isLoggedInPredicate,
  route: myAccountMenuItem.route.add("annotations"),
  tooltip: (user) => `Annotations created by ${getUserName(user)}`,
  title: () => "Annotations",
});

/**
 * Their Profile Menus
 */
export const theirProfileRoute = StrongRoute.newRoot()
  .add("user_accounts")
  .add(":accountId");

export const theirProfileCategory: Category = {
  icon: ["fas", "user-circle"],
  label: "Their Profile",
  route: theirProfileRoute,
};

export const theirProfileMenuItem = menuRoute({
  icon: theirProfileCategory.icon,
  label: "Their Profile",
  order: myAccountMenuItem.order,
  predicate: isLoggedInPredicate,
  route: theirProfileRoute,
  tooltip: () => "View their profile",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, User)?.userName,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return `${componentModel.account.model.userName}'s Profile`;
  }
});

export const theirEditMenuItem = menuRoute({
  icon: myEditMenuItem.icon,
  label: "Edit their profile",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this profile",
  disabled: "BETA: Will be available soon.",
  title: () => "Edit Profile",
});

export const theirProjectsMenuItem = menuRoute({
  icon: myProjectsMenuItem.icon,
  label: "Their Projects",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("projects"),
  tooltip: () => "Projects they can access",
  title: () => "Projects",
});

export const theirSitesMenuItem = menuRoute({
  icon: mySitesMenuItem.icon,
  label: "Their Sites",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("sites"),
  tooltip: () => "Sites they can access",
  title: () => "Sites",
});

export const theirBookmarksMenuItem = menuRoute({
  icon: myBookmarksMenuItem.icon,
  label: "Their Bookmarks",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("bookmarks"),
  tooltip: () => "Bookmarks created by them",
  title: () => "Bookmarks",
});

export const theirAnnotationsMenuItem = menuRoute({
  icon: myAnnotationsMenuItem.icon,
  label: "Their Annotations",
  parent: theirProfileMenuItem,
  predicate: isAdminPredicate,
  route: theirProfileMenuItem.route.add("annotations"),
  tooltip: () => "Annotations created by them",
  title: () => "Annotations",
});
