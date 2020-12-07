import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJobItem } from "@test/fakes/AnalysisJobItem";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";
import { AnalysisJobItemsService } from "./analysis-job-items.service";

type Model = AnalysisJobItem;
type Params = [IdOr<AnalysisJob>];
type Service = AnalysisJobItemsService;

describe("AnalysisJobItemsService", function () {
  const createModel = () => new AnalysisJobItem(generateAnalysisJobItem(10));
  const baseUrl = "/analysis_jobs/5/audio_recordings/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [AnalysisJobItemsService],
    });

    this.service = TestBed.inject(AnalysisJobItemsService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
});
