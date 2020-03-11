import { MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { homeCategory } from "../home/home.menus";

export const reportProblemsRoute = StrongRoute.Base.add("report_problem");

export const reportProblemsCategory = homeCategory;

export const reportProblemMenuItem = MenuRoute({
  icon: ["fas", "bug"],
  label: "Report Problem",
  route: reportProblemsRoute,
  tooltip: () => "Report a problem with the website",
  order: 9
});
