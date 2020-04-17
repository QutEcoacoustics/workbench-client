import { sitesCategory } from "@component/sites/sites.menus";
import { Category, MenuLink, MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { defaultAudioIcon, isAdminPredicate } from "src/app/app.menus";

export const adminRoute = StrongRoute.Base.add("admin");
export const adminCategory: Category = {
  icon: ["fas", "cog"],
  label: "Admin",
  route: adminRoute,
};

export const adminDashboardMenuItem = MenuRoute({
  icon: ["fas", "toolbox"],
  label: "Admin Home",
  route: adminRoute,
  tooltip: () => "Administrator dashboard",
  predicate: isAdminPredicate,
});

export const adminUserListMenuItem = MenuRoute({
  icon: ["fas", "user-cog"],
  label: "Users",
  route: adminRoute.add("user_accounts"),
  tooltip: () => "Manage user accounts",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminOrphanSitesMenuItem = MenuRoute({
  icon: sitesCategory.icon,
  label: "Orphan Sites",
  route: adminRoute.add("sites"),
  tooltip: () => "Manage orphaned sites",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAudioRecordingsMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminRoute.add("audio_recordings"),
  tooltip: () => "Manage audio recordings",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAnalysisJobsMenuItem = MenuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminRoute.add("analysis_jobs"),
  tooltip: () => "Manage analysis jobs",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminJobStatusMenuItem = MenuLink({
  icon: ["fas", "tasks"],
  label: "Job Status",
  tooltip: () => "Job queue status overview",
  uri: () => "/job_queue_status/overview",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});
