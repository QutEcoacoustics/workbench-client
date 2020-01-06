import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
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
  predicate: user => !!user,
  order: { priority: 2, indentation: 0 }
});

export const editMyAccountMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit my profile",
  route: myAccountMenuItem.route.add("edit"),
  parent: myAccountMenuItem,
  tooltip: () => "Change the details for your profile",
  predicate: user => !!user,
  order: {
    priority: myAccountMenuItem.order.priority,
    indentation: myAccountMenuItem.order.indentation + 1
  }
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
  order: myAccountMenuItem.order
});

export const theirEditProfileMenuItem = MenuRoute({
  icon: editMyAccountMenuItem.icon,
  label: "Edit their profile",
  route: theirProfileMenuItem.route.add("edit"),
  parent: theirProfileMenuItem,
  tooltip: () => "Change the details for this profile",
  predicate: user => !!user,
  order: editMyAccountMenuItem.order
});
