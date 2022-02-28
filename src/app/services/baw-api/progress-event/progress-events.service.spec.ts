import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProgressEvent } from "@models/ProgressEvent";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProgressEvent } from "@test/fakes/ProgressEvent";
import { validateReadAndCreateApi } from "@test/helpers/api-common";
import { ProgressEventsService } from "./progress-events.service";

describe("ProgressEventsService", (): void => {
  const createModel = () => new ProgressEvent(generateProgressEvent({ id: 5 }));
  const baseUrl = "/progress_events/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ProgressEventsService>;
  const createService = createServiceFactory({
    service: ProgressEventsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadAndCreateApi(
    spec,
    ProgressEvent,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
