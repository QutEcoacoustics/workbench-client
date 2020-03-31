import {
  defaultAudioIcon,
  defaultDeleteIcon,
  defaultEditIcon,
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
  route: adminRoute.add("scripts")
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

/**
 * Admin Tags
 */

const adminTagsRoute = adminRoute.add("tags");

export const adminTagsCategory: Category = {
  icon: ["fas", "tag"],
  label: "Tags",
  route: adminTagsRoute
};

export const adminTagsMenuItem = MenuRoute({
  icon: ["fas", "tag"],
  label: "Tags",
  route: adminTagsRoute,
  tooltip: () => "Manage tags",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminNewTagMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New Tag",
  route: adminTagsRoute.add("new"),
  tooltip: () => "Create a new tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate
});

const adminTagRoute = adminTagsRoute.add(":tagId");

export const adminEditTagMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit Tag",
  route: adminTagRoute.add("edit"),
  tooltip: () => "Edit an existing tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate
});

export const adminDeleteTagMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Tag",
  route: adminTagRoute.add("delete"),
  tooltip: () => "Delete an existing tag",
  parent: adminTagsMenuItem,
  predicate: isAdminPredicate
});

/**
 * Admin Tag Groups
 */

const adminTagGroupsRoute = adminRoute.add("tag_groups");

export const adminTagGroupsCategory: Category = {
  icon: ["fas", "tags"],
  label: "Tag Group",
  route: adminTagGroupsRoute
};

export const adminTagGroupsMenuItem = MenuRoute({
  icon: ["fas", "tags"],
  label: "Tag Group",
  route: adminTagGroupsRoute,
  tooltip: () => "Manage tag groups",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminNewTagGroupMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New Tag Group",
  route: adminTagGroupsRoute.add("new"),
  tooltip: () => "Create a new tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate
});

const adminTagGroupRoute = adminTagGroupsRoute.add(":tagGroupId");

export const adminEditTagGroupMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit Tag Group",
  route: adminTagGroupRoute.add("edit"),
  tooltip: () => "Update an existing tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate
});

export const adminDeleteTagGroupMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Tag Group",
  route: adminTagGroupRoute.add("delete"),
  tooltip: () => "Delete an existing tag group",
  parent: adminTagGroupsMenuItem,
  predicate: isAdminPredicate
});

/**
 * Admin Audio Recordings
 */

export const adminAudioRecordingCategory: Category = {
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminRoute.add("audio_recordings")
};

export const adminAudioRecordingsMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminAudioRecordingCategory.route,
  tooltip: () => "Manage audio recordings",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate
});

export const adminAudioRecordingMenuItem = MenuRoute({
  icon: ["fas", "play-circle"],
  label: "Audio Recording",
  route: adminAudioRecordingsMenuItem.route.add(":audioRecordingId"),
  tooltip: () => "Manage audio recording",
  parent: adminAudioRecordingsMenuItem,
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
