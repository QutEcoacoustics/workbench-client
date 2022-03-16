import { PermissionsShieldComponent } from "@menu/permissions-shield/permissions-shield.component";
import { isLoggedInPredicate } from "src/app/app.menus";
import { WidgetMenuItem } from "./widgetItem";

export const permissionsWidgetMenuItem = new WidgetMenuItem(
  PermissionsShieldComponent,
  isLoggedInPredicate
);
