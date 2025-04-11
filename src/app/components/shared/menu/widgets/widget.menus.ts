import { PermissionsShieldComponent } from "@menu/permissions-shield/permissions-shield.component";
import { isLoggedInPredicate } from "src/app/app.menus";
import { AllowsOriginalDownloadComponent } from "./allows-original-download/allows-original-download.component";
import { WidgetMenuItem } from "./widgetItem";
import { WebsiteStatusWarningComponent } from "./website-status-warning/website-status-warning.component";

export const permissionsWidgetMenuItem = new WidgetMenuItem(
  PermissionsShieldComponent,
  isLoggedInPredicate
);

export const allowsOriginalDownloadWidgetMenuItem = new WidgetMenuItem(
  AllowsOriginalDownloadComponent
);

/** A website status warning widget that warns if any part of the website is unhealthy */
export const websiteStatusWarningWidgetMenuItem = new WidgetMenuItem(
  WebsiteStatusWarningComponent
);
