import { audioAnalysesRoute } from "@components/audio-analysis/audio-analysis.menus";
import { AudioAnalysisModule } from "@components/audio-analysis/audio-analysis.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { NewAudioAnalysisComponent } from "./new.component";

describe("NewAudioAnalysisComponent", () => {
  validateBawClientPage(
    audioAnalysesRoute,
    NewAudioAnalysisComponent,
    [AudioAnalysisModule],
    "/audio_analysis/new",
    "Use this page to select the data to analyze, choose the analysis to run"
  );
});
