import { Category, menuRoute, MenuRoute } from "@interfaces/menusInterfaces";
import { siteMenuItem } from "@components/sites/sites.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { newVerificationRoute, verificationRoute, VerificationRoute } from "./verification.routes";

export type VerificationMenuRoutes = Record<VerificationRoute, MenuRoute>;

function makeViewVerificationCategory(subRoute: VerificationRoute): Category {
  return {
    icon: ["fas", "circle-check"],
    label: "Verification",
    route: verificationRoute[subRoute],
  };
}

function makeNewVerificationCategory(subRoute: VerificationRoute): Category {
  return {
    icon: ["fas", "circle-check"],
    label: "New Verification",
    route: newVerificationRoute[subRoute],
  };
}

function makeViewVerificationMenuItem(
  subRoute: VerificationRoute,
  parent?: MenuRoute,
) {
  return menuRoute({
    icon: ["fas", "circle-check"],
    label: "Verify this list",
    tooltip: () => "Verify audio events",
    route: verificationRoute[subRoute],
    parent,
  });
}

function makeNewVerificationMenuItem(
  subRoute: VerificationRoute,
  parent?: MenuRoute,
) {
  return menuRoute({
    icon: ["fas", "circle-check"],
    label: "New Verification",
    tooltip: () => "New verification",
    route: newVerificationRoute[subRoute],
    parent,
  });
}

const viewVerificationMenuItem: VerificationMenuRoutes = {
  /** /project/:projectId/site/:siteId/verification */
  site: makeViewVerificationMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: makeViewVerificationMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/verification */
  region: makeViewVerificationMenuItem("region", regionMenuItem),
  /** /project/:projectId/verification */
  project: makeViewVerificationMenuItem("project", projectMenuItem),
};

const newVerificationMenuitem: VerificationMenuRoutes = {
  /** /project/:projectId/site/:siteId/verification */
  site: makeNewVerificationMenuItem("site", siteMenuItem),
  /** /project/:projectId/region/:regionId/site/:siteId/verification */
  siteAndRegion: makeNewVerificationMenuItem("siteAndRegion", pointMenuItem),
  /** /project/:projectId/region/:regionId/verification */
  region: makeNewVerificationMenuItem("region", regionMenuItem),
  /** /project/:projectId/verification */
  project: makeNewVerificationMenuItem("project", projectMenuItem),
};

const viewVerificationCategory = {
  site: makeViewVerificationCategory("site"),
  siteAndRegion: makeViewVerificationCategory("siteAndRegion"),
  region: makeViewVerificationCategory("region"),
  project: makeViewVerificationCategory("project"),
};

const newVerificationCategory = {
  site: makeNewVerificationCategory("site"),
  siteAndRegion: makeNewVerificationCategory("siteAndRegion"),
  region: makeNewVerificationCategory("region"),
  project: makeNewVerificationCategory("project"),
};

export const verificationCategories = {
  new: newVerificationCategory,
  view: viewVerificationCategory,
};

export const verificationMenuItems = {
  new: newVerificationMenuitem,
  view: viewVerificationMenuItem,
};
