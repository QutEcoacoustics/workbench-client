import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";

describe("ScriptsService", function () {
  beforeEach(async(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ScriptsService],
    });
    this.service = TestBed.inject(ScriptsService);
  }));

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Script, ScriptsService>("/scripts/");
  validateApiFilter<Script, ScriptsService>("/scripts/filter");
  validateApiShow<Script, ScriptsService>(
    "/scripts/5",
    5,
    new Script({ id: 5 })
  );
  validateApiCreate<Script, ScriptsService>("/scripts/", new Script({ id: 5 }));
});
