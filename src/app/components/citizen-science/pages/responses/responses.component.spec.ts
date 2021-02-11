import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciResponsesComponent } from "./responses.component";

describe("CitSciResponsesComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciResponsesComponent,
    [CitizenScienceModule],
    "/citsci/example-question/responses",
    "Responses"
  );
});
