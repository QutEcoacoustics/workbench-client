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
import { RegionsService } from "./regions.service";

describe("RegionsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [RegionsService],
    });

    this.service = TestBed.inject(RegionsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Region, RegionsService>("/projects/5/regions/", undefined, 5);
  validateApiFilter<Region, RegionsService>(
    "/projects/5/regions/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<Region, RegionsService>(
    "/projects/5/regions/10",
    10,
    new Region({ id: 10 }),
    5
  );
  validateApiCreate<Region, RegionsService>(
    "/projects/5/regions/",
    new Region({ id: 10 }),
    5
  );
  validateApiUpdate<Region, RegionsService>(
    "/projects/5/regions/10",
    new Region({ id: 10 }),
    5
  );
  validateApiDestroy<Region, RegionsService>(
    "/projects/5/regions/10",
    10,
    new Region({ id: 10 }),
    5
  );
});
