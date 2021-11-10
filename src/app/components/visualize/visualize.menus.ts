import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { Region } from "@models/Region";

export const visualizeRoute = StrongRoute.newRoot().add(
  "visualize",
  ({ siteIds, siteId, projectId, extent0, extent1, lane }, { region }) => {
    const qsp = { extent0, extent1, lane };
    const priority = [
      { key: "siteId", value: siteId },
      { key: "siteIds", value: siteIds },
      { key: "siteIds", value: (region as Region)?.siteIds },
      { key: "projectId", value: projectId },
    ];
    const keyValuePair = priority.find((kvp) => isInstantiated(kvp.value));
    return isInstantiated(keyValuePair)
      ? { ...qsp, [keyValuePair.key]: keyValuePair.value }
      : qsp;
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
