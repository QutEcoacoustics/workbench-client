import { RouterStateSnapshot } from "@angular/router";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { isAdminPredicate } from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminAnalysisJobsRoute = adminRoute.addFeatureModule("analysis_jobs");

export const adminAnalysisJobsCategory = {
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminAnalysisJobsRoute,
} satisfies Category;

export const adminAnalysisJobsMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminAnalysisJobsCategory.route,
  tooltip: () => "Manage analysis jobs",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAnalysisJobMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Analysis Job",
  route: adminAnalysisJobsMenuItem.route.add(":analysisJobId"),
  tooltip: () => "Manage analysis job",
  parent: adminAnalysisJobsMenuItem,
  predicate: isAdminPredicate,
  title: (routeData: RouterStateSnapshot): string => {
    const componentModel = routeData.root.firstChild.data;
    return componentModel.analysisJob.model.name;
  },
});
