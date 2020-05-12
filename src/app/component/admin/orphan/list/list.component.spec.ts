import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { SharedModule } from "@shared/shared.module";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { testBawServices } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { AdminOrphansComponent } from "./list.component";

describe("AdminOrphansComponent", () => {
  let api: ShallowSitesService;
  let defaultModel: Site;
  let defaultModels: Site[];
  let fixture: ComponentFixture<AdminOrphansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrphansComponent],
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminOrphansComponent);
    api = TestBed.inject(ShallowSitesService);

    defaultModel = new Site({
      id: 1,
      name: "custom site",
    });
    defaultModels = [];
    for (let i = 0; i < 25; i++) {
      defaultModels.push(
        new Site({
          id: i,
          name: "site " + i,
        })
      );
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<Site, ShallowSitesService>("orphans");

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
