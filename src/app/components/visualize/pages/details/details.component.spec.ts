import { visualizeRoute } from "@components/visualize/visualize.routes";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { VisualizeComponent } from "./details.component";

describe("VisualizeComponent", () => {
  validateBawClientPage(
    visualizeRoute,
    VisualizeComponent,
    "/visualize",
    "Audio distribution"
  );

  assertPageInfo(VisualizeComponent, "View Timeline");
});
