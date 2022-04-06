import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { visualizeRoute } from "./visualize.routes";

export const visualizeCategory: Category = {
  icon: ["fas", "poll"],
  label: "Visualize",
  route: visualizeRoute,
};

export const visualizeMenuItem = menuRoute({
  icon: visualizeCategory.icon,
  label: "Visualize Audio",
  route: visualizeRoute,
  tooltip: () => "Explore an audio recording through visualization",
});
