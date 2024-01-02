import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { websiteStatusRoute } from "./website-status.routes";

export const websiteStatusCategory: Category = {
  icon: ["fas", "heartbeat"],
  label: "Website Status",
  route: websiteStatusRoute,
};

export const websiteStatusMenuItem = menuRoute({
  icon: ["fas", "heartbeat"],
  label: "Website Status",
  route: websiteStatusRoute,
  tooltip: () => "Website Status",
});
