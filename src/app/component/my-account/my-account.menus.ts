import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const myAccountRoute = StrongRoute.Base.add("my_account");

export const myAccountCategory: Category = {
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute
};

export const profileMenuItem = MenuRoute({
  icon: ["fas", "user"],
  label: "My Profile",
  route: myAccountRoute,
  tooltip: () => "View profile",
  predicate: user => !!user,
  order: { priority: 1, indentation: 0 }
});

export const editProfileMenuItem = MenuRoute({
  icon: ["fas", "edit"],
  label: "Edit my profile",
  route: profileMenuItem.route.add("edit"),
  parent: profileMenuItem,
  tooltip: () => "Change the details for this profile",
  predicate: user => !!user,
  order: {
    priority: profileMenuItem.order.priority,
    indentation: profileMenuItem.order.indentation + 1
  }
});
