import { homeCategory } from "@components/home/home.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const reportProblemsRoute = StrongRoute.base.add("report_problem");

export const reportProblemsCategory: Category = homeCategory;

export const reportProblemMenuItem = menuRoute({
  icon: ["fas", "bug"],
  label: "Report Problem",
  route: reportProblemsRoute,
  tooltip: () => "Report a problem with the website",
  order: 9,
});
