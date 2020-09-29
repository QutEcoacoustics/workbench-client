import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Region } from "@models/Region";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Region, ShallowRegionsService>("/regions/");
  validateApiFilter<Region, ShallowRegionsService>("/regions/filter");
  validateApiShow<Region, ShallowRegionsService>(
    "/regions/5",
    5,
    new Region({ id: 5 })
  );
  validateApiCreate<Region, ShallowRegionsService>(
    "/regions/",
    new Region({ id: 5 })
  );
  validateApiUpdate<Region, ShallowRegionsService>(
    "/regions/5",
    new Region({ id: 5 })
  );
  validateApiDestroy<Region, ShallowRegionsService>(
    "/regions/5",
    5,
    new Region({ id: 5 })
  );
});
