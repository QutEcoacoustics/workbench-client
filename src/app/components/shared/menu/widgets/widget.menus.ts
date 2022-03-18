import { PermissionsShieldComponent } from "@menu/permissions-shield/permissions-shield.component";
import { isLoggedInPredicate } from "src/app/app.menus";
import { AllowsOriginalDownloadComponent } from "./allows-original-download/allows-original-download.component";
import { WidgetMenuItem } from "./widgetItem";

export const permissionsWidgetMenuItem = new WidgetMenuItem(
  PermissionsShieldComponent,
  isLoggedInPredicate
);

export const allowsOriginalDownloadWidgetMenuItem = new WidgetMenuItem(
  AllowsOriginalDownloadComponent
);
