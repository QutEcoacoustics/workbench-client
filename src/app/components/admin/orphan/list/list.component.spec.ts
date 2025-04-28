import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { appLibraryImports } from "src/app/app.module";
import { AdminOrphansComponent } from "./list.component";

describe("AdminOrphansComponent", () => {
  let api: ShallowSitesService;
  let defaultModels: Site[];
  let fixture: ComponentFixture<AdminOrphansComponent>;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        RouterTestingModule,
        MockBawApiModule,
        AdminOrphansComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrphansComponent);
    api = TestBed.inject(ShallowSitesService);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new Site(generateSite()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
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
