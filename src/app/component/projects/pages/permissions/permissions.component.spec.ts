import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  projectResolvers,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { PermissionsComponent } from "./permissions.component";

describe("PermissionsComponent", () => {
  let api: ProjectsService;
  let component: PermissionsComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<PermissionsComponent>;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [PermissionsComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show
            },
            {
              project: {
                model: project,
                error: projectError
              }
            }
          )
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ProjectsService);

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project({
      id: 1,
      name: "Project"
    });
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined);
    expect(component).toBeTruthy();
  });

  // TODO Write unit tests
});
