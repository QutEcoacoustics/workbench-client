import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const visualizeRoute = StrongRoute.newRoot().add(
  "visualize",
  ({ siteIds, siteId, regionId, projectId, extent0, extent1, lane }) => {
    const qsp = {
      extent0,
      extent1,
      lane,
    };

    const priority = [
      { key: "siteId", value: siteId },
      { key: "siteIds", value: siteIds },
      { key: "projectId", value: projectId },
    ];
    const keyValuePair = priority.find((kvp) => isInstantiated(kvp.value));
    return keyValuePair
      ? qsp
      : { ...qsp, [keyValuePair.key]: keyValuePair.value };
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
