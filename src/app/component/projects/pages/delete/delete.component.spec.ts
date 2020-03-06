import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { submitForm } from "src/testHelpers";
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
          useClass: mockActivatedRoute({
            project: {
              model: project,
              error: projectError
            }
          })
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

  it("should create", () => {
    configureTestingModule(defaultProject, undefined);

    expect(component).toBeTruthy();
  });

  it("should handle project error", fakeAsync(() => {
    configureTestingModule(undefined, defaultError);

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  }));

  describe("form", () => {
    it("should eventually load form", () => {
      configureTestingModule(defaultProject, undefined);
      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should display form with project name in title", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);

      const title = fixture.nativeElement.querySelector("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Custom Project");
    }));

    it("should display form with red delete button", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);

      const button = fixture.nativeElement.querySelector("button.btn-danger");
      expect(button).toBeTruthy();
      expect(button.innerText).toContain("Delete");
    }));
  });

  describe("failed submissions", () => {
    it("should display form error on failure to submit", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        const subject = new Subject<void>();

        subject.error({
          status: 401,
          message: "You need to log in or register before continuing."
        } as ApiErrorDetails);

        return subject;
      });

      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "You need to log in or register before continuing."
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      submitForm(fixture);

      flush();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(button).toBeTruthy();
      expect(button.disabled).toBeFalsy("Button should not be disabled");
    }));
  });

  describe("successful submissions", () => {
    it("should delete project on submit", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);
      const deleteSpy = spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);
      expect(deleteSpy).toHaveBeenCalledWith(project);
    }));

    it("should navigate on successful submit", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        projectsMenuItem.route.toString()
      );
    }));

    it("should disable submit button while submitting", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "destroy").and.stub();

      submitForm(fixture);

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(button.disabled).toBeTruthy();
    }));
  });
});
