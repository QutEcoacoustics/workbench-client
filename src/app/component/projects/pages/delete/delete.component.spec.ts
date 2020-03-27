import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  projectResolvers,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertFormErrorHandling } from "src/testHelpers";
import { projectsMenuItem } from "../../projects.menus";
import { DeleteComponent } from "./delete.component";

describe("ProjectsDeleteComponent", () => {
  let api: ProjectsService;
  let component: DeleteComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<DeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [DeleteComponent],
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

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(ProjectsService);
    notifications = TestBed.inject(ToastrService);

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

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

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultProject, undefined);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, defaultError);
      assertFormErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "destroy").and.callThrough();
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to projects", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "destroy").and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        projectsMenuItem.route.toString()
      );
    });
  });
});
