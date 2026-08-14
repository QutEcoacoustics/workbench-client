import { ComponentFixture, TestBed } from "@angular/core/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { provideRouter } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { appLibraryImports } from "src/app/app.config";
import { AdminOrphansComponent } from "./list.component";

describe("AdminOrphansComponent", () => {
  let api: ShallowSitesService;
  let defaultModels: Site[];
  let fixture: ComponentFixture<AdminOrphansComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        AdminOrphansComponent,
      ],
      providers: [provideMockBawApi(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrphansComponent);
    api = TestBed.inject(ShallowSitesService);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new Site(generateSite()));
    }

    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    this.defaultModels = defaultModels;
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    this.fixture = fixture;
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<Site, ShallowSitesService>("orphanFilter");

  assertPageInfo(AdminOrphansComponent, "Orphan Sites");

  it("should create", () => {
    expect(fixture.componentInstance).toBeInstanceOf(AdminOrphansComponent);
  });

  // xdescribe("rows", () => {});
  // xdescribe("actions", () => {});
});
