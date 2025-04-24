import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciListenComponent } from "./listen.component";

describe("CitSciListenComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciListenComponent,
    "/citsci/example-question/listen",
    "Example Question"
  );
});
