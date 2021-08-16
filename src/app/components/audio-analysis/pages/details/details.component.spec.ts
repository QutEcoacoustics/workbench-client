import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { audioAnalysesRoute } from "@components/audio-analysis/audio-analysis.menus";
import { AudioAnalysisModule } from "@components/audio-analysis/audio-analysis.module";
import { AnalysisJob } from "@models/AnalysisJob";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { BehaviorSubject } from "rxjs";
import { AudioAnalysisComponent } from "./details.component";

describe("AudioAnalysisComponent", () => {
  validateBawClientPage(
    audioAnalysesRoute,
    AudioAnalysisComponent,
    [AudioAnalysisModule],
    "/audio_analysis/123",
    "Results are available as they are generated.",
    (spec) => {
      const analysisJobApi = spec.inject(AnalysisJobsService);
      analysisJobApi.show.andCallFake(
        (id: number) =>
          new BehaviorSubject(new AnalysisJob(generateAnalysisJob({ id })))
      );
    }
  );
});
