import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
import { Tagging } from "@models/Tagging";
import { createServiceFactory } from "@ngneat/spectator";
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
  const createModel = () => new Tagging(generateTagging({ id: 15 }));
  const baseUrl = "/audio_recordings/5/audio_events/10/taggings/";
  const updateUrl = baseUrl + "15";
  const createService = createServiceFactory({
    service: TaggingsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });
  validateApiList<Model, Params, Service>(baseUrl, 5, 10);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5, 10);
  validateApiShow<Model, Params, Service>(updateUrl, 15, createModel, 5, 10);
  validateApiCreate<Model, Params, Service>(
    baseUrl,
    updateUrl,
    createModel,
    5,
    10
  );
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel, 5, 10);
  validateApiDestroy<Model, Params, Service>(updateUrl, 15, createModel, 5, 10);
});
