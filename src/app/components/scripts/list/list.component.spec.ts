import { ComponentFixture, TestBed } from "@angular/core/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { generateScript } from "@test/fakes/Script";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { appLibraryImports } from "src/app/app.module";
import { provideRouter } from "@angular/router";
import { AdminScriptsComponent } from "./list.component";

describe("AdminScriptsComponent", () => {
  let api: ScriptsService;
  let defaultModels: Script[];
  let fixture: ComponentFixture<AdminScriptsComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        MockBawApiModule,
        AdminScriptsComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminScriptsComponent);
    api = TestBed.inject(ScriptsService);

    defaultModels = [];
    for (let id = 0; id < defaultApiPageSize; id++) {
      defaultModels.push(new Script(generateScript({ id })));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write tests
  assertPagination<Script, ScriptsService>();

  assertPageInfo(AdminScriptsComponent, "Scripts");

  it("should create", () => {
    expect(fixture.componentInstance).toBeInstanceOf(AdminScriptsComponent);
  });

  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});
