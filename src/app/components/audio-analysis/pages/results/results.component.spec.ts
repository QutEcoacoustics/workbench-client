import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { AudioAnalysisModule } from "@components/audio-analysis/audio-analysis.module";
import { AnalysisJob } from "@models/AnalysisJob";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { BehaviorSubject } from "rxjs";
import { audioAnalysesRoute } from "@components/audio-analysis/audio-analysis.routes";
import { AnalysisJobResultsComponent } from "./results.component";

describe("AudioAnalysisResultsComponent", () => {
  validateBawClientPage(
    audioAnalysesRoute,
    AnalysisJobResultsComponent,
    [AudioAnalysisModule],
    "/audio_analysis/123/results",
    "Results are available as they are generated. There is a basic file explorer below",
    (spec) => {
      const analysisJobApi = spec.inject(AnalysisJobsService);
      analysisJobApi.show.andCallFake(
        (id: number) =>
          new BehaviorSubject(new AnalysisJob(generateAnalysisJob({ id })))
      );
    }
  );
});
