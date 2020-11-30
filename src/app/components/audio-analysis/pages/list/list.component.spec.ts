import { audioAnalysesRoute } from "@components/audio-analysis/audio-analysis.menus";
import { AudioAnalysisModule } from "@components/audio-analysis/audio-analysis.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { AudioAnalysesComponent } from "./list.component";

describe("AudioAnalysesComponent", () => {
  validateBawClientPage(
    audioAnalysesRoute,
    AudioAnalysesComponent,
    [AudioAnalysisModule],
    "/audio_analysis",
    "This is a list of analysis jobs you have access to."
  );
});
