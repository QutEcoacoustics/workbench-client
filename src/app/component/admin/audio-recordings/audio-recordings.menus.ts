import { Category, MenuRoute } from "@interfaces/menusInterfaces";
import { defaultAudioIcon, isAdminPredicate } from "src/app/app.menus";
import { adminDashboardMenuItem, adminRoute } from "../admin.menus";

export const adminAudioRecordingsRoute = adminRoute.addFeatureModule(
  "audio_recordings"
);

export const adminAudioRecordingsCategory: Category = {
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminAudioRecordingsRoute,
};

export const adminAudioRecordingsMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Audio Recordings",
  route: adminAudioRecordingsCategory.route,
  tooltip: () => "Manage audio recordings",
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminAudioRecordingMenuItem = MenuRoute({
  icon: defaultAudioIcon,
  label: "Audio Recording",
  route: adminAudioRecordingsMenuItem.route.add(":audioRecording"),
  tooltip: () => "Manage audio recording",
  parent: adminAudioRecordingsMenuItem,
  predicate: isAdminPredicate,
});
