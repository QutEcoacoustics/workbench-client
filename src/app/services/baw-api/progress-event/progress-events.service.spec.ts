import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProgressEvent } from "@models/ProgressEvent";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProgressEvent } from "@test/fakes/ProgressEvent";
import {
  validateApiCreate,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";
import { ProgressEventsService } from "./progress-events.service";

type Model = ProgressEvent;
type Params = [];
type Service = ProgressEventsService;

describe("ProgressEventsService", function () {
  const createModel = () => new ProgressEvent(generateProgressEvent({ id: 5 }));
  const baseUrl = "/progress_events/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: ProgressEventsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
});
