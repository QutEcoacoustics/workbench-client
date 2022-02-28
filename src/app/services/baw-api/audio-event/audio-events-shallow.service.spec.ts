import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import {
  validateApiFilter,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { ShallowAudioEventsService } from "./audio-events.service";

type Model = AudioEvent;
type Service = ShallowAudioEventsService;

describe("Shallow AudioEventsService", (): void => {
  const baseUrl = "/audio_events/";
  let spec: SpectatorService<ShallowAudioEventsService>;
  const createService = createServiceFactory({
    service: ShallowAudioEventsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateApiFilter(spec, AudioEvent, baseUrl + "filter");

  validateCustomApiFilter<Model, [IdOr<User>], Service>(
    spec,
    AudioEvent,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  validateCustomApiFilter<Model, [IdOr<Site>], Service>(
    spec,
    AudioEvent,
    baseUrl + "filter",
    "filterBySite",
    { filter: { ["audio_recordings.site_id" as any]: { eq: 5 } } },
    undefined,
    5
  );
});
