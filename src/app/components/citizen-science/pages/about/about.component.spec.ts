import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciAboutComponent } from "./about.component";

describe("CitSciAboutComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciAboutComponent,
    "/citsci/example-question",
    (text: string) =>
      !!text.includes("Get Started") || !!text.includes("get started!")
  );
});
