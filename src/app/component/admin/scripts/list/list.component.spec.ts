import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { assertPagination } from "src/app/test/helpers/pagedTableTemplate";
import { testBawServices } from "src/app/test/helpers/testbed";
import { AdminScriptsComponent } from "./list.component";

describe("AdminScriptsComponent", () => {
  let api: ScriptsService;
  let defaultModel: Script;
  let defaultModels: Script[];
  let fixture: ComponentFixture<AdminScriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminScriptsComponent);
    api = TestBed.inject(ScriptsService);

    defaultModel = new Script({
      id: 1,
      name: "script",
      version: 0.1,
      executableCommand: "command",
    });
    defaultModels = [];
    for (let i = 0; i < 25; i++) {
      defaultModels.push(
        new Script({
          id: i,
          name: "script " + i,
          version: 0.1,
          executableCommand: "command",
        })
      );
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
