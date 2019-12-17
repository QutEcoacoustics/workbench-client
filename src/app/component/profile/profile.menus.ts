import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const myAccountRoute = StrongRoute.Base.add("my_account");
export const profileRoute = StrongRoute.Base.add("user_accounts");

export const myAccountCategory: Category = {
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute
};
export const profileCategory: Category = {
  icon: ["fas", "user"],
  label: "Their Profile",
  route: profileRoute
};

export const myAccountMenuItem = MenuRoute({
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute,
  tooltip: () => "View profile",
  predicate: user => !!user,
  order: { priority: 2, indentation: 0 }
});

export const profileMenuItem = MenuRoute({
  icon: ["fas", "user"],
  label: "Their Profile",
  route: profileRoute.add(":userId"),
  tooltip: () => "View their profile",
  order: {
    priority: myAccountMenuItem.order.priority,
    indentation: myAccountMenuItem.order.indentation
  }
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

export const editProfileMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit their profile",
  route: profileMenuItem.route.add("edit"),
  parent: profileMenuItem,
  tooltip: () => "Change the details for this profile",
  predicate: user => !!user,
  order: {
    priority: profileMenuItem.order.priority,
    indentation: profileMenuItem.order.indentation + 1
  }
});
