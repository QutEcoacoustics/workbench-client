import { AudioAnalysisModule } from "@components/audio-analysis/audio-analysis.module";
import { audioAnalysesRoute } from "@components/audio-analysis/audio-analysis.routes";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { NewAudioAnalysisJobComponent } from "./new.component";

describe("NewAudioAnalysisComponent", () => {
  validateBawClientPage(
    audioAnalysesRoute,
    NewAudioAnalysisJobComponent,
    [AudioAnalysisModule],
    "/audio_analysis/new",
    "Use this page to select the data to analyze, choose the analysis to run"
  );

  assertPageInfo(NewAudioAnalysisJobComponent, "New Analysis Job");
});
