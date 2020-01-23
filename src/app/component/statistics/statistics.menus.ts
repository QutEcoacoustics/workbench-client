import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { homeCategory } from "../home/home.menus";

export const statisticsRoute = StrongRoute.Base.add("website_statistics");

export const statisticsCategory: Category = homeCategory;

export const statisticsMenuItem = MenuRoute({
  icon: ["fas", "chart-line"],
  label: "Statistics",
  route: statisticsRoute,
  tooltip: () => "Annotation and audio recording statistics",
  order: { priority: 10 }
});
