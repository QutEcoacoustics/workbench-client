import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ProgressEvent } from "@models/ProgressEvent";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "src/app/test/helpers/api-common";
import { ProgressEventsService } from "./progress-events.service";

describe("ProgressEventsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ProgressEventsService],
    });

    this.service = TestBed.inject(ProgressEventsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<ProgressEvent, ProgressEventsService>("/progress_events/");
  validateApiFilter<ProgressEvent, ProgressEventsService>(
    "/progress_events/filter"
  );
  validateApiShow<ProgressEvent, ProgressEventsService>(
    "/progress_events/5",
    5,
    new ProgressEvent({ id: 5 })
  );
  validateApiCreate<ProgressEvent, ProgressEventsService>(
    "/progress_events/",
    new ProgressEvent({ id: 5 })
  );
});
