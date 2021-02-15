import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const citSciRoute = StrongRoute.newRoot().add("citsci");
const studyRoute = citSciRoute.add(":studyName");

export const citSciCategory: Category = {
  icon: ["fas", "microscope"],
  label: "Citizen Science",
  route: studyRoute,
};

export const citSciAboutMenuItem = menuRoute({
  icon: ["fas", "info-circle"],
  label: "Study",
  tooltip: () => "About the citizen science question",
  route: studyRoute,
});

export const citSciResponsesMenuItem = menuRoute({
  icon: ["fas", "poll"],
  label: "Responses",
  tooltip: () => "Responses for the citizen science question",
  route: studyRoute.add("responses"),
  parent: citSciAboutMenuItem,
});

const listenRoute = studyRoute.add("listen");

export const citSciListenMenuItem = menuRoute({
  icon: ["fas", "headphones"],
  label: "Listen",
  tooltip: () => "Listen to the citizen science question",
  route: listenRoute,
  parent: citSciAboutMenuItem,
});

export const citSciListenItemMenuItem = menuRoute({
  icon: ["fas", "assistive-listening-systems"],
  label: "Sample",
  tooltip: () => "Sample from the listening set",
  route: listenRoute.add(":sampleNum"),
  parent: citSciListenMenuItem,
});
