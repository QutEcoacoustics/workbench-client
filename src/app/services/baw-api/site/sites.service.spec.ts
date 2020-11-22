import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Site } from "@models/Site";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateSite } from "@test/fakes/Site";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { SitesService } from "./sites.service";

describe("SitesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [SitesService],
    });

    this.service = TestBed.inject(SitesService);
  });

  validateApiList<Site, SitesService>("/projects/5/sites/", undefined, 5);
  validateApiFilter<Site, SitesService>(
    "/projects/5/sites/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<Site, SitesService>(
    "/projects/5/sites/10",
    10,
    new Site(generateSite(10)),
    5
  );
  validateApiCreate<Site, SitesService>(
    "/projects/5/sites/",
    new Site(generateSite(10)),
    5
  );
  validateApiUpdate<Site, SitesService>(
    "/projects/5/sites/10",
    new Site(generateSite(10)),
    5
  );
  validateApiDestroy<Site, SitesService>(
    "/projects/5/sites/10",
    10,
    new Site(generateSite(10)),
    5
  );
});
