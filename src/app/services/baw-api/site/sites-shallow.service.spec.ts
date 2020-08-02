import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Site } from "@models/Site";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { ShallowSitesService } from "./sites.service";

describe("ShallowSitesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowSitesService],
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

  // TODO Add tests for filterByAccessLevel and Orphans
});
