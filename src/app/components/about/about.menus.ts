import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const aboutRoute = StrongRoute.newRoot().add("about");

export const aboutCategory: Category = {
  icon: ["fas", "info-circle"],
  label: "About",
  route: aboutRoute,
};

export const contactUsMenuItem = menuRoute({
  icon: ["fas", "question-circle"],
  label: "Contact Us",
  route: aboutRoute.add("contact_us"),
  tooltip: () => "Contact us about general enquiries",
});

export const creditsMenuItem = menuRoute({
  icon: ["fas", "hands-helping"],
  label: "Credits",
  route: aboutRoute.add("credits"),
  tooltip: () => "Credits",
});

export const disclaimersMenuItem = menuRoute({
  icon: ["fas", "exclamation-circle"],
  label: "Disclaimers",
  route: aboutRoute.add("disclaimers"),
  tooltip: () => "Disclaimers",
});

export const ethicsMenuItem = menuRoute({
  icon: ["fas", "balance-scale"],
  label: "Ethics",
  route: aboutRoute.add("ethics"),
  tooltip: () => "Ethics",
});
