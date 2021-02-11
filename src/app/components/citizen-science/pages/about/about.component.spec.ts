import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciAboutComponent } from "./about.component";

describe("CitSciAboutComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciAboutComponent,
    [CitizenScienceModule],
    "/citsci/example-question",
    "Get Started"
  );
});
