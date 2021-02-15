import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { CitSciListenItemComponent } from "./listen-item.component";

describe("CitSciListenItemComponent", () => {
  validateBawClientPage(
    citSciRoute,
    CitSciListenItemComponent,
    [CitizenScienceModule],
    "/citsci/example-question/listen/123456789",
    "Example Question"
  );
});
