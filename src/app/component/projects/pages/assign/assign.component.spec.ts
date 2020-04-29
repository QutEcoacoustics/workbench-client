import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/projects.service";
import { SitesService } from "@baw-api/sites.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { AssignComponent } from "./assign.component";

describe("AssignComponent", () => {
  let api: SitesService;
  let component: AssignComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<AssignComponent>;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AssignComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
            },
            {
              project: {
                model: project,
                error: projectError,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(SitesService);

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project({
      id: 1,
      name: "Project",
    });
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined);
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
