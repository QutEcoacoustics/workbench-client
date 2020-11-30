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
  route: listenRoute.add(":audioRecordingId", ({ start, end }) => ({
    start,
    end,
  })),
  tooltip: () => "Listen to recent audio recordings",
});
