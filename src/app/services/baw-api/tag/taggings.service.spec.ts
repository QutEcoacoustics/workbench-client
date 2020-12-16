import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
import { Tagging } from "@models/Tagging";
import { MockAppConfigModule } from "@services/config/configMock.module";
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

type Model = Tagging;
type Params = [IdOr<AnalysisJob>, IdOr<AudioEvent>];
type Service = TaggingsService;

describe("TaggingsService", function () {
  const createModel = () => new Tagging(generateTagging(15));
  const baseUrl = "/audio_recordings/5/audio_events/10/taggings/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [TaggingsService],
    });

    this.service = TestBed.inject(TaggingsService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5, 10);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5, 10);
  validateApiShow<Model, Params, Service>(
    baseUrl + "15",
    15,
    createModel,
    5,
    10
  );
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5, 10);
  validateApiUpdate<Model, Params, Service>(baseUrl + "15", createModel, 5, 10);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "15",
    15,
    createModel,
    5,
    10
  );
});
