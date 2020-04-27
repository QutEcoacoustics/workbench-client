import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioEventComment } from "@models/AudioEventComment";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { AudioEventCommentsService } from "./audio-event-comments.service";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";

describe("AudioEventCommentsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AudioEventCommentsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AudioEventCommentsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/",
    undefined,
    5
  );
  validateApiFilter<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/10",
    10,
    new AudioEventComment({ id: 10 }),
    5
  );
  validateApiCreate<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/",
    new AudioEventComment({ id: 10 }),
    5
  );
  validateApiUpdate<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/10",
    new AudioEventComment({ id: 10 }),
    5
  );
  validateApiDestroy<AudioEventComment, AudioEventCommentsService>(
    "/analysis_jobs/5/comments/10",
    10,
    new AudioEventComment({ id: 10 }),
    5
  );
});
