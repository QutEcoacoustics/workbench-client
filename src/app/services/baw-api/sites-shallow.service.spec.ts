import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Site } from "@models/Site";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { ShallowSitesService } from "./sites.service";

xdescribe("ShallowSitesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        ShallowSitesService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(ShallowSitesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Site, ShallowSitesService>("/sites/");
  validateApiFilter<Site, ShallowSitesService>("/sites/filter");
  validateApiShow<Site, ShallowSitesService>(
    "/sites/5",
    5,
    new Site({ id: 5 })
  );
  validateApiCreate<Site, ShallowSitesService>("/sites/", new Site({ id: 5 }));
  validateApiUpdate<Site, ShallowSitesService>("/sites/5", new Site({ id: 5 }));
  validateApiDestroy<Site, ShallowSitesService>(
    "/sites/5",
    5,
    new Site({ id: 5 })
  );
});
