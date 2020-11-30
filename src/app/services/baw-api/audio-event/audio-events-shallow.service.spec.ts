import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiFilter,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { ShallowAudioEventsService } from "./audio-events.service";

type Model = AudioEvent;
type Params = [];
type Service = ShallowAudioEventsService;

describe("Shallow AudioEventsService", function () {
  const baseUrl = "/audio_events/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ShallowAudioEventsService],
    });

    this.service = TestBed.inject(ShallowAudioEventsService);
  });

  validateApiFilter<Model, Params, Service>(baseUrl + "filter");

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  validateCustomApiFilter<Model, [...Params, IdOr<Site>], Service>(
    baseUrl + "filter",
    "filterBySite",
    { filter: { ["audio_recordings.site_id" as any]: { eq: 5 } } },
    undefined,
    5
  );
});
