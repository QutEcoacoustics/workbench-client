import { RouterTestingModule } from "@angular/router/testing";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnalysisJob } from "@models/AnalysisJob";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { AdminAnalysisJobsComponent } from "./list.component";

describe("AdminAnalysisJobsComponent", () => {
  let api: AnalysisJobsService;
  let defaultModels: AnalysisJob[];
  let spec: Spectator<AdminAnalysisJobsComponent>;
  const createComponent = createComponentFactory({
    detectChanges: false,
    component: AdminAnalysisJobsComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  beforeEach(function () {
    spec = createComponent();
    api = spec.inject(AnalysisJobsService);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AnalysisJob(generateAnalysisJob()));
    }

    this.defaultModels = defaultModels;
    this.fixture = spec.fixture;
    this.api = api;
  });

  assertPagination<AnalysisJob, AnalysisJobsService>();

  // TODO Write Tests
  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
