import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { defaultEditIcon, isLoggedInPredicate } from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { AudioEventImport } from "@models/AudioEventImport";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { RouterStateSnapshot } from "@angular/router";
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

// we cannot include a route guard predicate for "project editor"
// as the annotation imports are mounted under the root path
// "http://ecosounds.org/batch_annotations"
// therefore, we validate capabilities in the import component during the dry
// run
export const annotationsImportMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Import Annotations",
  predicate: isLoggedInPredicate,
  route: annotationsImportRoute,
  tooltip: () => "(BETA) View bulk imports for this project",
});

export const annotationImportMenuItem = menuRoute({
  icon: ["fas", "file-import"],
  label: "Batch Import Annotation",
  parent: annotationsImportMenuItem,
  predicate: isLoggedInPredicate,
  route: annotationImportRoute,
  tooltip: () => "(BETA) View bulk imports for this project",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, AudioEventImport)?.name,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel?.audioEventImport.model?.name;
  },
});

export const newAnnotationImportMenuItem = menuRoute({
  icon: ["fas", "upload"],
  label: "Import New Annotations",
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
