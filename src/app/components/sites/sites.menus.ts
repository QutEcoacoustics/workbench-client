import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolvers/resolver-common";
import { Category, menuItem, menuRoute } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import {
  defaultAnnotationDownloadIcon,
  defaultEditIcon,
  defaultNewIcon,
  isProjectEditorPredicate,
} from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { projectMenuItem } from "../projects/projects.menus";
import { siteRoute, sitesRoute } from "./sites.routes";

export const sitesCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Sites",
  route: siteRoute,
};

export const siteMenuItem = menuRoute({
  icon: ["fas", "map-marker-alt"],
  label: "Site",
  parent: projectMenuItem,
  route: sitesCategory.route,
  tooltip: () => "The current site",
  breadcrumbResolve: (pageInfo) => retrieveResolvedModel(pageInfo, Site)?.name,
  title: (routeData: RouterStateSnapshot) => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel.site.model.name;
  }
});

export const newSiteMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New site",
  parent: projectMenuItem,
  predicate: isProjectEditorPredicate,
  route: sitesRoute.add("new"),
  tooltip: () => "Create a new site",
});

export const siteAnnotationsMenuItem = menuItem({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  parent: siteMenuItem,
  tooltip: () => "Download annotations for this site",
});

export const editSiteMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this site",
  parent: siteMenuItem,
  predicate: isProjectEditorPredicate,
  route: siteMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this site",
  title: () => CommonRouteTitles.routeEditTitle,
});
