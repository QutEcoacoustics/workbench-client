import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const listenRoute = StrongRoute.newRoot().add("listen");

export const listenCategory: Category = {
  icon: ["fas", "headphones"],
  label: "Listen",
  route: listenRoute,
};

export const listenMenuItem = menuRoute({
  icon: ["fas", "headphones"],
  label: "Listen",
  route: listenRoute,
  tooltip: () => "Listen to recent audio recordings",
});

export const listenRecordingMenuItem = menuRoute({
  icon: ["fas", "play"],
  label: "Play",
  route: listenRoute.add(":audioRecordingId", ({ start, end, padding }) => ({
    start: isInstantiated(start)
      ? Math.max(0, Math.floor(start) - (padding ?? 0))
      : undefined,
    end: isInstantiated(end) ? Math.ceil(end) + (padding ?? 0) : undefined,
  })),
  tooltip: () => "Listen to an audio recording",
});
