import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const visualizeRoute = StrongRoute.newRoot().add(
  "visualize",
  ({ siteId, regionId, projectId, extent0, extent1, lane }) => {
    const qsp = {
      extent0,
      extent1,
      lane,
    };

    if (siteId) {
      return { siteId, ...qsp };
    } else if (regionId) {
      return { regionId, ...qsp };
    } else if (projectId) {
      return { projectId, ...qsp };
    } else {
      return qsp;
    }
  }
);

export const visualizeCategory: Category = {
  icon: ["fas", "poll"],
  label: "Visualize",
  route: visualizeRoute,
};

export const visualizeMenuItem = menuRoute({
  icon: visualizeCategory.icon,
  label: "Explore Audio",
  route: visualizeRoute,
  tooltip: () => "Explore and audio recording through visualization",
});
