import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule, FormlyFieldConfig } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { LoadingComponent } from "../loading/loading.component";
import { flattenFields, FormComponent } from "./form.component";

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler("click", eventObj);
  }
}

describe("FormComponent", () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let defaultSchema: any;

  function createSchema(field: FormlyFieldConfig[]) {
    return {
      model: {},
      fields: field
    };
  }

  function findInput(
    selector: string = "input",
    position: number = 0
  ): HTMLElement {
    const input = fixture.nativeElement.querySelectorAll("form " + selector)[
      position
    ];

    return input;
  }

  function assertInput(input: any, type?: string, required?: boolean) {
    expect(input).toBeTruthy();
    expect(input.required).toBe(required ? required : false);

    if (type) {
      expect(input.type).toBe(type);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(formlyRoot),
        FormlyBootstrapModule
      ],
      declarations: [FormComponent, LoadingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    defaultSchema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false
          }
        }
      ]
    };
  });

  it("should create", () => {
    component.schema = defaultSchema;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("Form Layout", () => {
    it("should create form", () => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
    });

    it("should create form with title", () => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
      component.title = "Title";
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Title");
    });

    it("should create form with subtitle", () => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
      component.subTitle = "Sub Title";
      fixture.detectChanges();

      const subtitle = fixture.nativeElement.querySelector("h6");
      expect(subtitle).toBeTruthy();
      expect(subtitle.innerText).toContain("Sub Title");
    });

    it("should create form with submit button label", () => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector("button");
      expect(button).toBeTruthy();
      expect(button.innerText).toContain("Label");
    });
  });

  xdescribe("Notifications", () => {
    beforeEach(() => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
    });

    // TODO Write notification tests when Toastr is added
  });

  describe("Submit Button Type", () => {
    beforeEach(() => {
      component.schema = defaultSchema;
      component.submitLabel = "Label";
      component.submitLoading = false;
    });

    function assertSubmit(className: string) {
      const submit = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(submit).toBeTruthy();
      expect(submit.classList.value).toContain(className);
    }

    it("should create form with default submit button", () => {
      fixture.detectChanges();
      assertSubmit("btn-success");
    });

    it("should create form with danger submit button", () => {
      component.btnColor = "btn-danger";
      fixture.detectChanges();
      assertSubmit("btn-danger");
    });

    it("should create form with success submit button", () => {
      component.btnColor = "btn-success";
      fixture.detectChanges();
      assertSubmit("btn-success");
    });

    it("should create form with warning submit button", () => {
      component.btnColor = "btn-warning";
      fixture.detectChanges();
      assertSubmit("btn-warning");
    });

    it("should create form with primary submit button", () => {
      component.btnColor = "btn-primary";
      fixture.detectChanges();
      assertSubmit("btn-primary");
    });

    it("should create form with secondary submit button", () => {
      component.btnColor = "btn-secondary";
      fixture.detectChanges();
      assertSubmit("btn-secondary");
    });

    it("should create form with info submit button", () => {
      component.btnColor = "btn-info";
      fixture.detectChanges();
      assertSubmit("btn-info");
    });
  });

  describe("Input Types", () => {
    beforeEach(() => {
      component.submitLabel = "Label";
      component.submitLoading = false;
    });

    it("should create input form", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false
          }
        }
      ]);
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "text");
    });

    it("should create password form", () => {
      component.schema = component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "password",
            label: "input element",
            required: false
          }
        }
      ]);
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "password");
    });

    it("should create email form", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "email",
            label: "input element",
            required: false
          }
        }
      ]);
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "email");
    });

    it("should create textarea form", () => {
      component.schema = createSchema([
        {
          key: "message",
          type: "textarea",
          templateOptions: {
            label: "Message",
            rows: 8,
            required: false
          }
        }
      ]);
      fixture.detectChanges();

      const input = findInput("textarea");
      assertInput(input);
    });

    it("should create multi form", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false
          }
        },
        {
          key: "password",
          type: "input",
          templateOptions: {
            type: "password",
            label: "password element",
            required: false
          }
        },
        {
          key: "email",
          type: "input",
          templateOptions: {
            type: "email",
            label: "email element",
            required: false
          }
        }
      ]);
      fixture.detectChanges();

      let textInput = findInput(undefined, 0);
      let passwordInput = findInput(undefined, 1);
      let emailInput = findInput(undefined, 2);
      assertInput(textInput, "text");
      assertInput(passwordInput, "password");
      assertInput(emailInput, "email");
    });

    it("should create required input form", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      fixture.detectChanges();

      let input = findInput();
      assertInput(input, "text", true);
    });

    it("should create required multi input form", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        },
        {
          key: "password",
          type: "input",
          templateOptions: {
            type: "password",
            label: "password element",
            required: true
          }
        },
        {
          key: "email",
          type: "input",
          templateOptions: {
            type: "email",
            label: "email element",
            required: true
          }
        }
      ]);
      fixture.detectChanges();

      let textInput = findInput(undefined, 0);
      let passwordInput = findInput(undefined, 1);
      let emailInput = findInput(undefined, 2);
      assertInput(textInput, "text", true);
      assertInput(passwordInput, "password", true);
      assertInput(emailInput, "email", true);
    });
  });

  describe("Submit", () => {
    let buttonPressed: boolean;

    beforeEach(() => {
      component.submitLabel = "Label";
      component.submitLoading = false;
    });

    function submit() {
      buttonPressed = false;
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe(data => {
        buttonPressed = true;
      });
      fixture.detectChanges();
    }

    it("should call submit function OnClick", () => {
      component.schema = defaultSchema;
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeTruthy();
    });

    it("should call submit function OnClick with user input", done => {
      component.schema = defaultSchema;
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe(data => {
        expect(data).toBeTruthy();
        expect(data).toEqual({ input: "user input" });
        done();
      });

      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input");
      input.value = "user input";
      input.dispatchEvent(new Event("input"));

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();
    });

    it("should not call submit function OnClick when required field is empty", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeFalsy();
    });

    it("should call submit function OnClick with filled required user input", done => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe(data => {
        expect(data).toBeTruthy();
        expect(data).toEqual({ input: "user input" });
        done();
      });

      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input");
      input.value = "user input";
      input.dispatchEvent(new Event("input"));

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();
    });

    it("should show error message when required field is empty OnSubmit", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeFalsy();

      const alert = fixture.nativeElement.querySelector("ngb-alert");
      expect(alert).toBeTruthy();
      expect(alert.innerText).toContain("Please fill all required fields.");
    });

    it("should highlight missing field when required field is empty OnSubmit", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeFalsy();

      const input = fixture.nativeElement.querySelector("input");
      const hint = fixture.nativeElement.querySelector("div.invalid-feedback");

      expect(input).toBeTruthy();
      expect(input.classList.value).toContain("is-invalid");
      expect(hint).toBeTruthy();
    });

    it("should highlight multiple missing fields when required fields are empty OnSubmit", () => {
      component.schema = createSchema([
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        },
        {
          key: "input2",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false
          }
        },
        {
          key: "input3",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]);
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeFalsy();

      const inputs = fixture.nativeElement.querySelectorAll("input");
      const hints = fixture.nativeElement.querySelectorAll(
        "div.invalid-feedback"
      );

      expect(inputs[0].classList.value).toContain("is-invalid");
      expect(inputs[1].classList.value).toContain("ng-valid");
      expect(inputs[2].classList.value).toContain("is-invalid");
      expect(hints.length).toBe(2);
    });

    it("should show custom error message", () => {
      component.schema = defaultSchema;
      component.error = "Custom Error";

      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector("ngb-alert");
      expect(alert).toBeTruthy();
      expect(alert.innerText).toContain("Custom Error");
    });

    it("should update with custom error after submission", () => {
      component.schema = defaultSchema;
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe(() => {
        component.error = "Custom Error";
      });

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector("ngb-alert");
      expect(alert).toBeTruthy();
      expect(alert.innerText).toContain("Custom Error");
    });

    it("should handle custom expression", () => {
      component.schema = createSchema([
        {
          key: "register",
          validators: {
            fieldMatch: {
              expression:
                "return (control.value.passwordConfirm === control.value.password" +
                " || (!control.value.passwordConfirm || !control.value.password))",
              message: "Passwords do not match",
              errorPath: "passwordConfirm"
            }
          },
          fieldGroup: [
            {
              key: "password",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password",
                required: true
              }
            },
            {
              key: "passwordConfirm",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password Confirmation",
                required: true
              },
              expressionProperties: {
                "templateOptions.disabled": "!model.password"
              }
            }
          ]
        }
      ]);
      fixture.detectChanges();

      const passwordInput = findInput(undefined, 0);
      const passwordConfInput = findInput(undefined, 1);

      assertInput(passwordInput, "password", true);
      assertInput(passwordConfInput, "password", true);
    });

    it("should submit with correct custom expression", done => {
      component.schema = createSchema([
        {
          key: "register",
          validators: {
            fieldMatch: {
              expression:
                "return (control.value.passwordConfirm === control.value.password" +
                " || (!control.value.passwordConfirm || !control.value.password))",
              message: "Passwords do not match",
              errorPath: "passwordConfirm"
            }
          },
          fieldGroup: [
            {
              key: "password",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password",
                required: true
              }
            },
            {
              key: "passwordConfirm",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password Confirmation",
                required: true
              },
              expressionProperties: {
                "templateOptions.disabled": "!model.password"
              }
            }
          ]
        }
      ]);
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe(data => {
        expect(data).toBeTruthy();
        expect(data).toEqual({
          register: {
            password: "user input",
            passwordConfirm: "user input"
          }
        });
        done();
      });
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector("form");
      const inputs = form.querySelectorAll("input");

      inputs[0].value = "user input";
      inputs[0].dispatchEvent(new Event("input"));
      inputs[1].value = "user input";
      inputs[1].dispatchEvent(new Event("input"));

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();
    });

    // TODO Fix this test or the form component
    xit("should not submit with bad response custom expression", () => {
      component.schema = createSchema([
        {
          key: "register",
          validators: {
            fieldMatch: {
              expression:
                "return (control.value.passwordConfirm === control.value.password" +
                " || (!control.value.passwordConfirm || !control.value.password))",
              message: "Passwords do not match",
              errorPath: "passwordConfirm"
            }
          },
          fieldGroup: [
            {
              key: "password",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password",
                required: true
              }
            },
            {
              key: "passwordConfirm",
              type: "input",
              templateOptions: {
                type: "password",
                label: "Password Confirmation",
                required: true
              },
              expressionProperties: {
                "templateOptions.disabled": "!model.password"
              }
            }
          ]
        }
      ]);
      submit();

      const form = fixture.nativeElement.querySelector("form");
      const inputs = form.querySelectorAll("input");

      inputs[0].value = "user input";
      inputs[0].dispatchEvent(new Event("input"));
      inputs[1].value = "user input 2";
      inputs[1].dispatchEvent(new Event("input"));

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBe(false);
    });
  });

  describe("Schema Url Handling", () => {
    beforeEach(() => {
      component.submitLabel = "Label";
      component.submitLoading = false;
    });

    function catchRequest(
      url: string,
      response: any,
      meta?: { status: number; statusText: string }
    ) {
      const req = httpMock.expectOne(url);
      req.flush(response, meta ? meta : { status: 200, statusText: "OK" });
    }

    it("should handle schemaUrl", () => {
      const url = `http://${window.location.host}/assets/tests/externalSchema.json`;
      component.schemaUrl = url;
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it("should request schemaUrl when given", () => {
      const url = `http://${window.location.host}/assets/tests/externalSchema.json`;
      component.schemaUrl = url;
      fixture.detectChanges();

      const req = httpMock.expectOne(url);
      expect(req).toBeTruthy();
    });

    it("should handle schema url http request failure", () => {
      const url = "https://brokenlink/";
      component.schemaUrl = url;
      fixture.detectChanges();

      catchRequest(url, {}, { status: 404, statusText: "Resource not found" });
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector("ngb-alert");
      expect(alert).toBeTruthy();
      expect(alert.innerText).toContain("Resource not found");
    });

    it("should create form with schemaUrl", () => {
      const url = `http://${window.location.host}/assets/tests/externalSchema.json`;
      component.schemaUrl = url;
      fixture.detectChanges();

      catchRequest(
        url,
        createSchema([
          {
            key: "name",
            type: "input",
            templateOptions: {
              label: "Your name",
              required: false
            }
          },
          {
            key: "email",
            type: "input",
            templateOptions: {
              type: "email",
              label: "Contact Email",
              required: false
            }
          },
          {
            key: "message",
            type: "textarea",
            templateOptions: {
              label: "Message",
              rows: 8,
              required: false
            }
          }
        ])
      );
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
    });

    it("should create inputs with schemaUrl", () => {
      const url = `http://${window.location.host}/assets/tests/externalSchema.json`;
      component.schemaUrl = url;
      fixture.detectChanges();

      catchRequest(
        url,
        createSchema([
          {
            key: "name",
            type: "input",
            templateOptions: {
              label: "Your name",
              required: false
            }
          },
          {
            key: "email",
            type: "input",
            templateOptions: {
              type: "email",
              label: "Contact Email",
              required: false
            }
          },
          {
            key: "message",
            type: "textarea",
            templateOptions: {
              label: "Message",
              rows: 8,
              required: false
            }
          }
        ])
      );
      fixture.detectChanges();

      const textInput = findInput(undefined, 0);
      const emailInput = findInput(undefined, 1);
      const textareaInput = findInput("textarea", 0);

      assertInput(textInput, "text");
      assertInput(emailInput, "email");
      assertInput(textareaInput, undefined);
    });
  });

  describe("Flattening Output Object", () => {
    it("should flatten empty object", () => {
      const model = {};
      const output = flattenFields(model);

      expect(output).toEqual(model);
    });

    it("should flatten string value object", () => {
      const model = { key: "value" };
      const output = flattenFields(model);

      expect(output).toEqual(model);
    });

    it("should flatten number value object", () => {
      const model = { key: 42 };
      const output = flattenFields(model);

      expect(output).toEqual(model);
    });

    it("should flatten string field group object", () => {
      const model = {
        group: {
          group1: "value1",
          group2: "value2"
        }
      };
      const flattened = {
        group1: "value1",
        group2: "value2"
      };
      const output = flattenFields(model);

      expect(output).toEqual(flattened);
    });

    it("should flatten number field group object", () => {
      const model = {
        group: {
          group1: 2,
          group2: 3
        }
      };
      const flattened = {
        group1: 2,
        group2: 3
      };
      const output = flattenFields(model);

      expect(output).toEqual(flattened);
    });

    it("should remove empty field group object", () => {
      const model = {
        group: {}
      };
      const flattened = {};
      const output = flattenFields(model);

      expect(output).toEqual(flattened);
    });

    it("should flatten mixed object", () => {
      const model = {
        key: "value1",
        group: {
          group1: "value2",
          group2: 42
        }
      };
      const flattened = {
        key: "value1",
        group1: "value2",
        group2: 42
      };
      const output = flattenFields(model);

      expect(output).toEqual(flattened);
    });

    it("should flatten multiple mixed object", () => {
      const model = {
        key1: "value1",
        group: {
          group1: "value2",
          group2: 42
        },
        key2: 42,
        section: {
          section1: 42,
          section2: "value3"
        },
        empty: {}
      };
      const flattened = {
        key1: "value1",
        group1: "value2",
        group2: 42,
        key2: 42,
        section1: 42,
        section2: "value3"
      };
      const output = flattenFields(model);

      expect(output).toEqual(flattened);
    });
  });
});
