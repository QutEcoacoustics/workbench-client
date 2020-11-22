import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Region } from "@models/Region";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateRegion } from "@test/fakes/Region";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { ShallowRegionsService } from "./regions.service";

describe("ShallowRegionsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowRegionsService],
    });

    this.service = TestBed.inject(ShallowRegionsService);
  });

  validateApiList<Region, ShallowRegionsService>("/regions/");
  validateApiFilter<Region, ShallowRegionsService>("/regions/filter");
  validateApiShow<Region, ShallowRegionsService>(
    "/regions/5",
    5,
    new Region(generateRegion(5))
  );
  validateApiCreate<Region, ShallowRegionsService>(
    "/regions/",
    new Region(generateRegion(5))
  );
  validateApiUpdate<Region, ShallowRegionsService>(
    "/regions/5",
    new Region(generateRegion(5))
  );
  validateApiDestroy<Region, ShallowRegionsService>(
    "/regions/5",
    5,
    new Region(generateRegion(5))
  );
});
