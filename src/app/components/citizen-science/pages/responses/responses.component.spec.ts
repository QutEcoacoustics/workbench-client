import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciResponsesComponent } from "./responses.component";

describe("CitSciResponsesComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciResponsesComponent,
    "/citsci/example-question/responses",
    "Responses"
  );
});
