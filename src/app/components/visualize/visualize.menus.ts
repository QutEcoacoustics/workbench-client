import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { visualizeRoute } from "./visualize.routes";

export const visualizeCategory: Category = {
  icon: ["fas", "timeline"],
  label: "Timeline",
  route: visualizeRoute,
};

export const visualizeMenuItem = menuRoute({
  icon: visualizeCategory.icon,
  label: "View Timeline",
  route: visualizeRoute,
  tooltip: () => "Explore the timeline of audio recordings through visualization",
});
