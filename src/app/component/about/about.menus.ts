import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const aboutRoute = StrongRoute.Base.add("about");

export const aboutCategory: Category = {
  icon: ["fas", "info-circle"],
  label: "About",
  route: aboutRoute
};

export const contactUsMenuItem = MenuRoute({
  icon: ["fas", "question-circle"],
  label: "Contact Us",
  route: aboutRoute.add("contact_us"),
  tooltip: () => "Contact us about general enquiries"
});
