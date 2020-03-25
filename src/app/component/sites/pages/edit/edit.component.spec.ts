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
import {
  siteResolvers,
  SitesService
} from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import {
  getInputs,
  inputValue,
  submitForm,
  testFormlyField
} from "src/testHelpers";
import { fields } from "../../site.json";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let api: SitesService;
  let component: EditComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let defaultSite: Site;
  let fixture: ComponentFixture<EditComponent>;
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
    projectError: ApiErrorDetails,
    site: Site,
    siteError: ApiErrorDetails
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
              project: projectResolvers.show,
              site: siteResolvers.show
            },
            {
              project: {
                model: project,
                error: projectError
              },
              site: {
                model: site,
                error: siteError
              }
            }
          )
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
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
    defaultSite = new Site({
      id: 1,
      name: "Site"
    });
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined, defaultSite, undefined);

    expect(component).toBeTruthy();
  });

  it("should handle project error", fakeAsync(() => {
    configureTestingModule(undefined, defaultError, defaultSite, undefined);

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  }));

  it("should handle site error", fakeAsync(() => {
    configureTestingModule(defaultProject, undefined, undefined, defaultError);

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  }));

  describe("form", () => {
    it("should eventually load form", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should contain six inputs", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      expect(
        fixture.nativeElement.querySelectorAll("form formly-field").length
      ).toBe(7); // FieldGroup adds a formly-field
    });

    it("should display form with site name in title", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);

      const title = fixture.nativeElement.querySelector("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Custom Site");
    }));

    /* Site Name Input */
    testFormlyField(
      "Site Name Input",
      () => {
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
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
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
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
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
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
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
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
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
      },
      fields[3],
      "image",
      "image",
      false,
      "Image"
    );

    /* Site Timezone Input */
    testFormlyField(
      "Site Timezone Input",
      () => {
        configureTestingModule(
          defaultProject,
          undefined,
          defaultSite,
          undefined
        );
      },
      fields[4],
      "timezoneInformation",
      "timezone",
      false,
      "Time Zone"
    );

    // TODO Add input validation for custom location logic

    it("should pre-fill project name", () => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);

      const inputs = getInputs(fixture);
      expect(inputs[nameIndex].querySelector("input").value).toBe(
        "Custom Site"
      );
    });

    it("should pre-fill project description", () => {
      const site = new Site({
        id: 1,
        name: "Site",
        description: "Custom Description"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);

      const inputs = getInputs(fixture);
      expect(inputs[descriptionIndex].querySelector("textarea").value).toBe(
        "Custom Description"
      );
    });
  });

  describe("form error handling", () => {
    it("should show error message with missing project name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);

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
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update").and.callFake(() => {
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

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Site>();

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
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Site");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalled();
    }));

    it("should call update with random id", fakeAsync(() => {
      const site = new Site({
        id: 5,
        name: "Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Site");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalledWith(
        new Site({ id: 5, name: "Test Site" }),
        defaultProject
      );
    }));

    it("should call update with name", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Site");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalledWith(
        new Site({ id: 1, name: "Test Site" }),
        defaultProject
      );
    }));

    it("should call update with description", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      inputValue(inputs[1], "textarea", "Test Description");
      submitForm(fixture);

      expect(api.update).toHaveBeenCalledWith(
        new Site({
          id: 1,
          name: "Test Project",
          description: "Test Description"
        }),
        defaultProject
      );
    }));

    xit("should call update with image", fakeAsync(() => {}));
    xit("should call update with all inputs", fakeAsync(() => {}));

    it("should create success notification on submit", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Site>(
          new Site({
            id: 1,
            name: "Test Site"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Site");
      submitForm(fixture);

      expect(notifications.success).toHaveBeenCalledWith(
        "Site was successfully updated."
      );
    }));

    it("should navigate user to site on submit", fakeAsync(() => {
      const site = new Site({
        id: 5,
        name: "Test Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);

      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Site>(site);
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Project");
      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        site.redirectPath(defaultProject)
      );
    }));

    it("should disable submit button during submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
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
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(component, "resetForms");
      spyOn(api, "update").and.callFake(() => {
        return new BehaviorSubject<Site>(
          new Site({
            id: 1,
            name: "Test Project"
          })
        );
      });

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "Test Site");
      submitForm(fixture);

      expect(component.resetForms).toHaveBeenCalled();
      expect(component.isFormTouched()).toBeFalse();
    }));
  });
});
