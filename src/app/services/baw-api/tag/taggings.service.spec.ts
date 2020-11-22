import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Tagging } from "@models/Tagging";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateTagging } from "@test/fakes/Tagging";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { TaggingsService } from "./taggings.service";

describe("TaggingsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [TaggingsService],
    });

    this.service = TestBed.inject(TaggingsService);
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
    new Tagging(generateTagging(15)),
    5,
    10
  );
  validateApiCreate<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/",
    new Tagging(generateTagging(15)),
    5,
    10
  );
  validateApiUpdate<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/15",
    new Tagging(generateTagging(15)),
    5,
    10
  );
  validateApiDestroy<Tagging, TaggingsService>(
    "/audio_recordings/5/audio_events/10/taggings/15",
    15,
    new Tagging(generateTagging(15)),
    5,
    10
  );
});
