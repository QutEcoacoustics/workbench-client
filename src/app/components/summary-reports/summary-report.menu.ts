import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { projectMenuItem } from "@components/projects/projects.menus";
import { projectGenerateReportRoute, projectSummaryReportRoute } from "./summary-report.routes";

export const generateProjectSummaryReportCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Generate Summary Report",
  route: projectGenerateReportRoute,
};

export const summaryReportCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Summary Report",
  route: projectSummaryReportRoute,
};

export const generateSummaryReportMenuItem = menuRoute({
  icon: ["fas", "file"],
  label: "Generate Summary Report",
  parent: projectMenuItem,
  route: generateProjectSummaryReportCategory.route,
  tooltip: () => "Generate Summary Report",
  title: () => "Generate Summary Report"
});

export const summaryReportMenuItem = menuRoute({
  icon: ["fas", "file"],
  label: "Summary Report",
  parent: projectMenuItem,
  route: summaryReportCategory.route,
  tooltip: () => "Summary Report",
  title: () => "Summary Report",
});
