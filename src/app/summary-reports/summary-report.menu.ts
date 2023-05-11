import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { projectMenuItem } from "@components/projects/projects.menus";
import { projectGenerateReportRoute } from "./summary-report.routes";

export const generateProjectSummaryReportCategory: Category = {
  icon: ["fas", "map-marker-alt"],
  label: "Generate Summary Report",
  route: projectGenerateReportRoute,
};

export const generateSummaryReportMenuItem = menuRoute({
  icon: ["fas", "file"],
  label: "Generate Summary Report",
  parent: projectMenuItem,
  route: generateProjectSummaryReportCategory.route,
  tooltip: () => "Generate Summary Report",
  title: () => "Generate Summary Report"
});
