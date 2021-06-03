import { Category, menuItem, menuRoute } from "@interfaces/menusInterfaces";
import { ModalMenuItem } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import {
  defaultAnnotationDownloadIcon,
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectOwnerPredicate,
} from "src/app/app.menus";
import { projectMenuItem } from "../projects/projects.menus";

export const sitesRoute = projectMenuItem.route.addFeatureModule("sites");

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: sitesRoute.add(":siteId"),
};

export const siteMenuItem = menuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: sitesCategory.route,
  tooltip: () => "The current site",
});

export const newSiteMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isProjectOwnerPredicate,
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const siteAnnotationsMenuItem = new ModalMenuItem(
  menuItem({
    icon: defaultAnnotationDownloadIcon,
    label: "Download Annotations",
    parent: siteMenuItem,
    tooltip: () => "Download annotations for this site",
  }),
  AnnotationDownloadComponent
);

export const editSiteMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site",
});

export const siteHarvestMenuItem = menuRoute({
  icon: defaultAudioIcon,
  label: "Harvesting",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("harvest"),
  tooltip: () => "Upload new audio to this site",
});

export const deleteSiteMenuItem = menuRoute({
  icon: defaultDeleteIcon,
  label: "Delete site",
  parent: siteMenuItem,
  predicate: isProjectOwnerPredicate,
  route: siteMenuItem.route.add("delete"),
  tooltip: () => "Delete this site",
});
