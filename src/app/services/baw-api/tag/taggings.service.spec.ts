import { IdOr } from "@baw-api/api-common";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
import { Tagging } from "@models/Tagging";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateTagging } from "@test/fakes/Tagging";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { TaggingsService } from "./taggings.service";

type Model = Tagging;
type Params = [IdOr<AnalysisJob>, IdOr<AudioEvent>];
type Service = TaggingsService;

describe("TaggingsService", (): void => {
  const createModel = () => new Tagging(generateTagging({ id: 15 }));
  const baseUrl = "/audio_recordings/5/audio_events/10/taggings/";
  const updateUrl = baseUrl + "15";
  let spec: SpectatorService<TaggingsService>;

  const createService = createServiceFactory({
    service: TaggingsService,
    providers: mockServiceProviders,
  });

  beforeEach(function () {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Tagging,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    15,
    5,
    10
  );
});
