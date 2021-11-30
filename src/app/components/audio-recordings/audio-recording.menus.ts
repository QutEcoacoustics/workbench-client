import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const audioRecordingsRoute = StrongRoute.newRoot().add(
  "audio_recordings",
  ({ siteId, regionId, projectId }) => ({ siteId, regionId, projectId })
);

export const audioRecordingsCategory: Category = {
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  route: audioRecordingsRoute,
};

export const audioRecordingsMenuItem = menuRoute({
  icon: ["fas", "file-archive"],
  label: "Audio Recordings",
  tooltip: () => "View associated audio recordings",
  route: audioRecordingsRoute,
});

export const audioRecordingMenuItem = menuRoute({
  icon: ["fas", "file-audio"],
  label: "Audio Recording",
  tooltip: () => "View audio recording details",
  route: audioRecordingsMenuItem.route.add(":audioRecordingId"),
  parent: audioRecordingsMenuItem,
});
