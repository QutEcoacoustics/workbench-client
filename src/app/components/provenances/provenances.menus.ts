import { RouterStateSnapshot } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import {
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
} from "src/app/app.menus";
import { CommonRouteTitles } from "src/app/stringConstants";
import { provenanceRoute, provenancesRoute } from "./provenances.routes";

/*
  Provenances Category
*/
export const provenancesCategory: Category = {
  label: "Provenances",
  icon: ["fas", "fingerprint"],
  route: provenancesRoute,
};

export const provenancesMenuItem = menuRoute({
  icon: ["fas", "fingerprint"],
  label: "Provenances",
  route: provenancesRoute,
  tooltip: () => "View provenances",
  predicate: isAdminPredicate,
});

export const newProvenanceMenuItem = menuRoute({
  icon: defaultNewIcon,
  label: "New provenance",
  parent: provenancesMenuItem,
  predicate: isAdminPredicate,
  route: provenancesRoute.add("new"),
  tooltip: () => "Create a new provenance",
});

/*
  Provenance Category
*/

export const provenanceCategory: Category = {
  label: "Provenance",
  icon: provenancesCategory.icon,
  route: provenanceRoute,
};

export const provenanceMenuItem = menuRoute({
  icon: ["fas", "fingerprint"],
  label: "Provenance",
  parent: provenancesMenuItem,
  route: provenanceRoute,
  tooltip: () => "The current provenance",
  breadcrumbResolve: (pageInfo) =>
    retrieveResolvedModel(pageInfo, AudioEventProvenance)?.name,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel?.provenance?.model?.name ?? "Unknown";
  },
});

export const editProvenanceMenuItem = menuRoute({
  icon: defaultEditIcon,
  label: "Edit this provenance",
  parent: provenanceMenuItem,
  predicate: isAdminPredicate,
  route: provenanceMenuItem.route.add("edit"),
  tooltip: () => "Change the details for this provenance",
  title: () => CommonRouteTitles.routeEditTitle,
});
