import {
  defaultAudioIcon,
  defaultNewIcon,
  isAdminPredicate
} from "src/app/app.menus";
import {
  Category,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { sitesCategory } from "../sites/sites.menus";

export const adminRoute = StrongRoute.Base.add("admin");
export const adminCategory: Category = {
  icon: ["fas", "cog"],
  label: "Admin",
  route: adminRoute
};

export const adminDashboardMenuItem = MenuRoute({
  icon: ["fas", "toolbox"],
  label: "Admin Home",
  route: adminRoute,
  tooltip: () => "Administrator dashboard",
  predicate: isAdminPredicate
});

export const adminUserListMenuItem = MenuRoute({
  icon: ["fas", "user-cog"],
  label: "Users",
  route: adminRoute.add("user_accounts"),
  tooltip: () => "Manage user accounts",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminOrphanSitesMenuItem = MenuRoute({
  icon: sitesCategory.icon,
  label: "Orphan Sites",
  route: adminRoute.add("sites"),
  tooltip: () => "Manage orphaned sites",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

/*
  Admin Scripts
*/

export const adminScriptsCategory: Category = {
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: adminRoute.add("scripts"),
  parent: adminCategory
};

export const adminScriptsMenuItem = MenuRoute({
  icon: ["fas", "scroll"],
  label: "Scripts",
  route: adminScriptsCategory.route,
  tooltip: () => "Manage custom scripts",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminNewScriptsMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New Script",
  route: adminScriptsMenuItem.route.add("new"),
  tooltip: () => "Create a new script",
  parent: adminScriptsMenuItem,
  predicate: isAdminPredicate
});

export const adminTagsMenuItem = MenuRoute({
  icon: ["fas", "tag"],
  label: "Tags",
  route: adminRoute.add("tags"),
  tooltip: () => "Manage tags",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminNewTagMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New Tag",
  route: adminTagsMenuItem.route.add("new"),
  tooltip: () => "Create a new tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate
});

export const adminTagGroupsMenuItem = MenuRoute({
  icon: ["fas", "tags"],
  label: "Tag Group",
  route: adminRoute.add("tags"),
  tooltip: () => "Manage tags",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminNewTagGroupMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New Tag Group",
  route: adminTagsMenuItem.route.add("new"),
  tooltip: () => "Create a new tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate
});

export const adminAudioRecordingsMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminRoute.add("audio_recordings"),
  tooltip: () => "Manage audio recordings",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminAnalysisJobsMenuItem = MenuRoute({
  icon: ["fas", "server"],
  label: "Analysis Jobs",
  route: adminRoute.add("analysis_jobs"),
  tooltip: () => "Manage analysis jobs",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminJobStatusMenuItem = MenuLink({
  icon: ["fas", "tasks"],
  label: "Job Status",
  tooltip: () => "Job queue status overview",
  uri: () => "/job_queue_status/overview",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});
