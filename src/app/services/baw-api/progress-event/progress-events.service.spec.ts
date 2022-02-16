import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ProgressEvent } from "@models/ProgressEvent";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProgressEvent } from "@test/fakes/ProgressEvent";
import { validateReadAndCreateApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { ProgressEventsService } from "./progress-events.service";

describe("ProgressEventsService", (): void => {
  const createModel = () => new ProgressEvent(generateProgressEvent({ id: 5 }));
  const baseUrl = "/progress_events/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ProgressEventsService>;
  const createService = createServiceFactory({
    service: ProgressEventsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadAndCreateApi(
    () => spec,
    ProgressEvent,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
