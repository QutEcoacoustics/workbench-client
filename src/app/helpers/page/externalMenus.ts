import { menuLink } from "@interfaces/menusInterfaces";

export const analysisJobMenuItem = menuLink({
  icon: ["fas", "exclamation-triangle"],
  label: "Analysis Job Details",
  uri: () => "/fix_me",
  tooltip: () => "View analysis job",
});
