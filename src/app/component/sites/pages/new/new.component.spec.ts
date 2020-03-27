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
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import {
  assertValidationMessage,
  getInputs,
  inputValue,
  submitForm,
  testFormlyField
} from "src/testHelpers";
import { fields } from "../../site.json";
import { NewComponent } from "./new.component";

describe("SitesNewComponent", () => {
  let api: SitesService;
  let component: NewComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<NewComponent>;
  let notifications: ToastrService;
  let router: Router;

  const nameIndex = 0;
  const descriptionIndex = 1;
  const latitudeIndex = 3;
  const longitudeIndex = 4;
  const imageIndex = 5;
  const timezoneIndex = 6;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [NewComponent],
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
            },
            { projectId: project?.id }
          )
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(SitesService);
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

    it("should contain six inputs", () => {
      configureTestingModule(defaultProject, undefined);

      expect(
        fixture.nativeElement.querySelectorAll("form formly-field").length
      ).toBe(7); // FieldGroup adds a formly-field
    });

    /* Site Name Input */
    testFormlyField(
      "Site Name Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[0],
      "name",
      "input",
      true,
      "Site Name",
      "text"
    );

    /* Site Description Textarea */
    testFormlyField(
      "Site Description Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[1],
      "description",
      "textarea",
      false,
      "Description"
    );

    /* Site Latitude Input */
    testFormlyField(
      "Site Latitude Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[2].fieldGroup[0],
      "customLatitude",
      "input",
      false,
      "Latitude",
      "number"
    );

    /* Site Longitude Input */
    testFormlyField(
      "Site Longitude Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[2].fieldGroup[1],
      "customLongitude",
      "input",
      false,
      "Longitude",
      "number"
    );

    /* Site Image Input */
    testFormlyField(
      "Site Image Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[3],
      "image",
      "image",
      false,
      "Image"
    );

    /* Site Timezone Input */
    /* testFormlyField(
      "Site Timezone Input",
      () => {
        configureTestingModule(defaultProject, undefined);
      },
      fields[4],
      "timezoneInformation",
      "timezone",
      false,
      "Time Zone"
    ); */

    // TODO Add input validation for custom location logic
  });

  describe("form error handling", () => {
    it("should show error message with missing site name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);

      submitForm(fixture);
      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should show error message when only latitude is given", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      inputValue(inputs[latitudeIndex], "input", "5");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
      assertValidationMessage(
        inputs[longitudeIndex],
        "Both latitude and longitude must be set or left empty."
      );
    }));

    it("should show error message when only longitude is given", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      inputValue(inputs[longitudeIndex], "input", "5");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
      assertValidationMessage(
        inputs[longitudeIndex],
        "Both latitude and longitude must be set or left empty."
      );
    }));
  });

  describe("failed submissions", () => {
    it("should handle general error", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create").and.callFake(() => {
        const subject = new Subject<Site>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Site");
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create").and.callFake(() => {
        const subject = new Subject<Site>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Site");
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
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalled();
    }));

    it("should call create with name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalledWith(
        new Site({ name: "Test Site" }),
        defaultProject
      );
    }));

    it("should call create with description", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      inputValue(inputs[descriptionIndex], "textarea", "Test Description");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalledWith(
        new Site({
          name: "Test Site",
          description: "Test Description"
        }),
        defaultProject
      );
    }));

    it("should call create with location", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create");

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Test Site");
      inputValue(inputs[latitudeIndex], "input", "5");
      inputValue(inputs[longitudeIndex], "input", "10");
      submitForm(fixture);

      expect(api.create).toHaveBeenCalledWith(
        new Site({
          name: "Test Site",
          customLatitude: 5,
          customLongitude: 10
        }),
        defaultProject
      );
    }));

    xit("should call create with image", fakeAsync(() => {}));
    xit("should call create with timezone", fakeAsync(() => {}));

    it("should create notification on submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Site>(
          new Site({
            id: 1,
            name: "Custom Site"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[nameIndex], "input", "Custom Site");
      submitForm(fixture);

      expect(notifications.success).toHaveBeenCalledWith(
        "Successfully created Custom Site"
      );
    }));

    it("should navigate user to project on submit", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      const site = new Site({
        id: 1,
        name: "Site"
      });

      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Site>(site);
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Site");
      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        site.redirectPath(defaultProject)
      );
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined);
      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Site");
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
      spyOn(api, "create").and.callFake(() => {
        return new BehaviorSubject<Site>(
          new Site({
            id: 1,
            name: "Site"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Site");
      submitForm(fixture);

      expect(component.resetForms).toHaveBeenCalled();
      expect(component.isFormTouched()).toBeFalse();
    }));
  });
});
