import { Category, menuLink, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { isAdminPredicate } from "src/app/app.menus";

export const adminRoute = StrongRoute.newRoot().add("admin");
export const adminCategory: Category = {
  icon: ["fas", "cog"],
  label: "Admin",
  route: adminRoute,
};

export const adminDashboardMenuItem = menuRoute({
  icon: ["fas", "toolbox"],
  label: "Admin Home",
  route: adminRoute,
  tooltip: () => "Administrator dashboard",
  predicate: isAdminPredicate,
});

export const adminUserListMenuItem = menuRoute({
  icon: ["fas", "user-cog"],
  label: "Users",
  route: adminRoute.add("user_accounts"),
  tooltip: () => "Manage user accounts",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAnalysisJobsMenuItem = menuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminRoute.add("analysis_jobs"),
  tooltip: () => "Manage analysis jobs",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminJobStatusMenuItem = menuLink({
  icon: ["fas", "tasks"],
  label: "Job Status",
  tooltip: () => "Job queue status overview",
  uri: () => "/job_queue_status/overview",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminCmsMenuItem = menuLink({
  icon: ["fas", "newspaper"],
  label: "CMS",
  tooltip: () => "Content management system",
  uri: () => "/admin/cms",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});
