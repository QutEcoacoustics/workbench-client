import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ProgressEvent } from "@models/ProgressEvent";
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
  const createModel = () => new ProgressEvent(generateProgressEvent(5));
  const baseUrl = "/progress_events/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ProgressEventsService],
    });

    this.service = TestBed.inject(ProgressEventsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
});
