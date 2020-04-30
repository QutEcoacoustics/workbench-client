import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { MockBawApiService } from "@baw-api/mock/baseApiMock.service";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { AnalysisJobItemsService } from "../analysis-job-items.service";

describe("AnalysisJobItemsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AnalysisJobItemsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AnalysisJobItemsService);
  });

  validateApiList<AnalysisJobItem, AnalysisJobItemsService>(
    "/analysis_jobs/5/audio_recordings/",
    undefined,
    5
  );
  validateApiFilter<AnalysisJobItem, AnalysisJobItemsService>(
    "/analysis_jobs/5/audio_recordings/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<AnalysisJobItem, AnalysisJobItemsService>(
    "/analysis_jobs/5/audio_recordings/10",
    10,
    new AnalysisJobItem({ id: 10 }),
    5
  );
});
