import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Script } from "@models/Script";
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
import { ScriptsService } from "./scripts.service";

xdescribe("ScriptsService", function () {
  beforeEach(async(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        ScriptsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
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
  validateApiUpdate<Script, ScriptsService>(
    "/scripts/5",
    new Script({ id: 5 })
  );
  validateApiDestroy<Script, ScriptsService>(
    "/scripts/5",
    5,
    new Script({ id: 5 })
  );
});
