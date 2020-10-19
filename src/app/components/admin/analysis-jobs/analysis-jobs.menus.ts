import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminAnalysisJobsRoute = adminRoute.addFeatureModule(
  "analysis_jobs"
);

export const adminAnalysisJobsCategory: Category = {
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminAnalysisJobsRoute,
};

export const adminAnalysisJobsMenuItem = MenuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminAnalysisJobsCategory.route,
  tooltip: () => "Manage analysis jobs",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAnalysisJobMenuItem = MenuRoute({
  icon: ["fas", "server"],
  label: "Analysis Job",
  route: adminAnalysisJobsMenuItem.route.add(":analysisJobId"),
  tooltip: () => "Manage analysis job",
  parent: adminAnalysisJobsMenuItem,
  predicate: isAdminPredicate,
});
