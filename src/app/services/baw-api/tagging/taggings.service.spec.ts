import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { MockBawApiService } from "@baw-api/mock/baseApiMock.service";
import { Tagging } from "@models/Tagging";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { TaggingsService } from "./taggings.service";

describe("TaggingsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TaggingsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(TaggingsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/",
    undefined,
    5,
    10
  );
  validateApiFilter<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/filter",
    undefined,
    undefined,
    5,
    10
  );
  validateApiShow<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/15",
    15,
    new Tagging({ id: 15 }),
    5,
    10
  );
  validateApiCreate<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/",
    new Tagging({ id: 15 }),
    5,
    10
  );
  validateApiUpdate<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/15",
    new Tagging({ id: 15 }),
    5,
    10
  );
  validateApiDestroy<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/15",
    15,
    new Tagging({ id: 15 }),
    5,
    10
  );
});
