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
import {
  projectResolvers,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import {
  getInputs,
  inputValue,
  submitForm,
  testFormlyField
} from "src/testHelpers";
import { fields } from "../../project.json";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: ProjectsService;
  let component: EditComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<EditComponent>;
  let notifications: ToastrService;
  let router: Router;

  const nameIndex = 0;
  const descriptionIndex = 1;
  const imageIndex = 2;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [EditComponent],
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

    fixture = TestBed.createComponent(EditComponent);
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

    it("should contain three inputs", () => {
      configureTestingModule(defaultProject, undefined);
      expect(
        fixture.nativeElement.querySelectorAll("form formly-field").length
      ).toBe(3);
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

    /* Project Name Input */
    testFormlyField(
      "Project Name Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[0],
      "name",
      "input",
      true,
      "Project Name",
      "text"
    );

    /* Project Description Input */
    testFormlyField(
      "Project Description Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[1],
      "description",
      "textarea",
      false,
      "Description"
    );

    /* Project Image Input */
    testFormlyField(
      "Project Image Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[2],
      "image",
      "image",
      false,
      "Image"
    );

    it("should pre-fill project name", () => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);

      const inputs = getInputs(fixture);
      expect(inputs[nameIndex].querySelector("input").value).toBe(
        "Custom Project"
      );
    });

    it("should pre-fill project description", () => {
      const project = new Project({
        id: 1,
        name: "Project",
        description: "Custom Description"
      });
      configureTestingModule(project, undefined);

      const inputs = getInputs(fixture);
      expect(inputs[descriptionIndex].querySelector("textarea").value).toBe(
        "Custom Description"
      );
    });
  });

  describe("form error handling", () => {
    it("should show error message with missing project name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "");
      submitForm(fixture);
      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));
  });

  describe("failed submissions", () => {
    it("should handle general error", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Project");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    }));

    it("should handle duplicate project name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Record could not be saved",
          status: 422,
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Project");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Project");
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
    it("should call update", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Project");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalled();
    }));

    it("should call update with name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Project");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalledWith(
        new Project({ id: 1, name: "Test Project" })
      );
    }));

    it("should call update with description", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Project");
      inputValue(inputs[descriptionIndex], "textarea", "Test Description");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalledWith(
        new Project({
          id: 1,
          name: "Test Project",
          description: "Test Description"
        })
      );
    }));

    xit("should call update with image", fakeAsync(() => {}));

    it("should call update on submit", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Custom Project"
      });
      configureTestingModule(project, undefined);
      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Project>(
          new Project({
            id: 1,
            name: "Test Project"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Custom Project");
      submitForm(fixture);

      expect(notifications.success).toHaveBeenCalledWith(
        "Successfully updated Custom Project"
      );
    }));

    it("should navigate user to project on submit", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      const project = new Project({
        id: 1,
        name: "Project"
      });

      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Project>(project);
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Project");
      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalledWith(project.redirectPath());
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Project");
      submitForm(fixture);

      flush();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(button).toBeTruthy();
      expect(button.disabled).toBeTruthy("Button should be disabled");
    }));

    it("should reset form on successful submit", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(component, "resetForms");
      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Project>(
          new Project({
            id: 1,
            name: "Project"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Project");
      submitForm(fixture);

      expect(component.resetForms).toHaveBeenCalled();
      expect(component.isFormTouched()).toBeFalse();
    }));
  });
});
