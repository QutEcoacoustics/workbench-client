import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { defaultEditIcon, isLoggedInPredicate } from "src/app/app.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { RouterStateSnapshot } from "@angular/router";
import { AudioEventImport } from "@models/AudioEventImport";
import { CommonRouteTitles } from "src/app/stringConstants";
import {
  addAnnotationImportRoute,
  annotationImportRoute,
  annotationsImportRoute,
  newAnnotationImportRoute,
} from "./import-annotations.routes";

export const annotationsImportCategory: Category = {
  icon: ["fas", "file-import"],
  label: "Import Annotations",
  route: annotationsImportRoute,
};

export const annotationsImportMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Import Annotations",
  parent: projectMenuItem,
  predicate: isLoggedInPredicate,
  route: annotationsImportRoute,
  tooltip: () => "(BETA) View annotation imports for this project",
});

export const annotationImportMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Import Annotations",
  parent: annotationsImportMenuItem,
  predicate: isLoggedInPredicate,
  route: annotationImportRoute,
  tooltip: () => "(BETA) View annotation imports for this project",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, AudioEventImport)?.name,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel?.audioEventImport.model?.name;
  },
});

export const newAnnotationImportMenuItem = menuRoute({
  icon: ["fas", "upload"],
  label: "New Annotation Import",
  parent: annotationsImportMenuItem,
  predicate: isLoggedInPredicate,
  route: newAnnotationImportRoute,
  primaryBackground: true,
  tooltip: () => "(BETA) Import new annotations to this project",
});

export const editAnnotationImportMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this annotation import",
  parent: annotationImportMenuItem,
  predicate: isLoggedInPredicate,
  route: annotationImportMenuItem.route.add("edit"),
  tooltip: () => "(BETA) Edit this annotation import",
  title: () => CommonRouteTitles.routeEditTitle,
});

export const addAnnotationImportMenuItem = menuRoute({
  icon: ["fas", "plus"],
  label: "Add New Annotations",
  parent: annotationImportMenuItem,
  predicate: isLoggedInPredicate,
  route: addAnnotationImportRoute,
  tooltip: () => "(BETA) Add new annotations",
  title: () => "Add New Annotations",
});
