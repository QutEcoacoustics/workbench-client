import { visualizeRoute } from "@components/visualize/visualize.routes";
import { VisualizeModule } from "@components/visualize/visualize.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { VisualizeComponent } from "./details.component";

describe("VisualizeComponent", () => {
  validateBawClientPage(
    visualizeRoute,
    VisualizeComponent,
    [VisualizeModule],
    "/visualize",
    "Audio distribution"
  );
});
