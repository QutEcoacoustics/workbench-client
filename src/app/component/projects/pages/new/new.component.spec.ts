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
import {
  getInputs,
  inputValue,
  submitForm,
  testFormlyField
} from "src/testHelpers";
import { fields } from "../../project.json";
import { NewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  let api: ProjectsService;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let notifications: ToastrService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [NewComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute()
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    api = TestBed.inject(ProjectsService);
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("form", () => {
    it("should eventually load form", () => {
      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should contain three inputs", () => {
      expect(
        fixture.nativeElement.querySelectorAll("form formly-field").length
      ).toBe(3);
    });

    /* Project Name Input */
    testFormlyField(
      "Project Name Input",
      undefined,
      fields[0],
      "name",
      "input",
      true,
      "Project Name",
      "text"
    );

    /* Project Description Textarea */
    testFormlyField(
      "Project Description Input",
      undefined,
      fields[1],
      "description",
      "textarea",
      false,
      "Description"
    );

    /* Project Image Input */
    testFormlyField(
      "Project Image Input",
      undefined,
      fields[2],
      "image",
      "image",
      false,
      "Image"
    );
  });

  describe("form error handling", () => {
    it("should not call submit function with missing project name", fakeAsync(() => {
      spyOn(component, "submit");

      submitForm(fixture);
      expect(component.submit).not.toHaveBeenCalled();
    }));

    it("should show error message with missing project name", fakeAsync(() => {
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));
  });

  describe("failed submissions", () => {
    it("should handle duplicate project name", fakeAsync(() => {
      spyOn(api, "create").and.callFake(() => {
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
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    }));

    it("should handle general error", fakeAsync(() => {
      spyOn(api, "create").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      spyOn(api, "create").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Project");
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
    it("should call create", fakeAsync(() => {
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalled();
    }));

    it("should call create with name", fakeAsync(() => {
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalledWith(
        new Project({ name: "Test Project" })
      );
    }));

    it("should call create with description", fakeAsync(() => {
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      inputValue(inputs[1], "textarea", "Test Description");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalledWith(
        new Project({
          name: "Test Project",
          description: "Test Description"
        })
      );
    }));

    xit("should call create with image", fakeAsync(() => {}));
    xit("should call create with all inputs", fakeAsync(() => {}));

    it("should create success notification on submit", fakeAsync(() => {
      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Project>(
          new Project({
            id: 1,
            name: "Custom Project"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Custom Project");
      submitForm(fixture);

      expect(notifications.success).toHaveBeenCalledWith(
        "Successfully created Custom Project"
      );
    }));

    it("should navigate user to project on submit", fakeAsync(() => {
      const project = new Project({
        id: 1,
        name: "Test Project"
      });

      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Project>(project);
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalledWith(project.redirectPath());
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Project");
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
      spyOn(component, "resetForms");
      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Project>(
          new Project({
            id: 1,
            name: "Test Project"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(component.resetForms).toHaveBeenCalled();
      expect(component.isFormTouched()).toBeFalse();
    }));
  });
});
