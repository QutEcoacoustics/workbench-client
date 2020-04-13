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

export const creditsMenuItem = MenuRoute({
  icon: ["fas", "hands-helping"],
  label: "Credits",
  route: aboutRoute.add("credits"),
  tooltip: () => "Credits"
});

export const disclaimersMenuItem = MenuRoute({
  icon: ["fas", "exclamation-circle"],
  label: "Disclaimers",
  route: aboutRoute.add("disclaimers"),
  tooltip: () => "Disclaimers"
});

export const ethicsMenuItem = MenuRoute({
  icon: ["fas", "balance-scale"],
  label: "Ethics",
  route: aboutRoute.add("ethics"),
  tooltip: () => "Ethics"
});
