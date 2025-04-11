import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciListenComponent } from "./listen.component";

describe("CitSciListenComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciListenComponent,
    [CitizenScienceModule],
    "/citsci/example-question/listen",
    "Example Question"
  );
});
