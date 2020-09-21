import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { SharedModule } from "@shared/shared.module";
import { generateScript } from "@test/fakes/Script";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { appLibraryImports } from "src/app/app.module";
import { AdminScriptsComponent } from "./list.component";

describe("AdminScriptsComponent", () => {
  let api: ScriptsService;
  let defaultModel: Script;
  let defaultModels: Script[];
  let fixture: ComponentFixture<AdminScriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsComponent],
      imports: [
        SharedModule,
        RouterTestingModule,
        ...appLibraryImports,
        MockBawApiModule,
      ],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminScriptsComponent);
    api = TestBed.inject(ScriptsService);

    defaultModel = new Script(generateScript());
    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new Script(generateScript(i)));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write tests
  assertPagination<Script, ScriptsService>();

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
