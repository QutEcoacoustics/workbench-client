import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AssignComponent } from "./assign.component";

describe("AssignComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let component: AssignComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<AssignComponent>;

  function configureTestingModule(model: Project, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AssignComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { project: projectResolvers.show },
            { project: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ShallowSitesService) as SpyObject<ShallowSitesService>;
    api.filter.and.callFake(() => new Subject());

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  it("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeTruthy();
  });

  xit("should display project in title", () => {});
  xit("should display descriptive text", () => {});

  xdescribe("projects api", () => {
    it("should request project using project id", () => {});
    it("should request project using random project id", () => {});
  });

  xdescribe("sites api", () => {
    it("should send filter request", () => {});
    it("should request first page of data on load", () => {});
    it("should request custom page of data on table page change", () => {});
  });

  xdescribe("table", () => {
    it("should contain table", () => {});
    it("should have checkbox option", () => {});
    it("should handle single selection", () => {});
    it("should handle multiple selections", () => {});
    it("should handle change page", () => {});
    it("should handle skipping to last page", () => {});
    it("should not be sortable", () => {});
    it("should handle single page table", () => {});
    it("should handle multi page table", () => {});
    it("should display total number of sites with single page", () => {});
    it("should display total number of sites with multiple pages", () => {});
  });
});
