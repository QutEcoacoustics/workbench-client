import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { validationMessages } from "src/app/app.helper";
import { FormComponent } from "./form.component";

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
          validationMessages
        }),
        FormlyBootstrapModule
      ],
      declarations: [FormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
  });

  it("should create", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should create form", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();
  });

  it("should create form with submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit).toBeTruthy();
  });

  it("should create form with danger submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-danger";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-danger");
  });

  it("should create form with success submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-success";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-success");
  });

  it("should create form with warning submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-warning";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-warning");
  });

  it("should create form with primary submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-primary";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-primary");
  });

  it("should create form with secondary submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-secondary";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-secondary");
  });

  it("should create form with info submit button", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.btnColor = "btn-info";
    fixture.detectChanges();

    const submit = fixture.debugElement.nativeElement.querySelector("button");
    expect(submit.classList.value).toContain("btn-info");
  });

  it("should create input form", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const input = form.querySelector("input");
    expect(input).toBeTruthy();
    expect(input.type).toBe("text");
    expect(input.required).toBe(false);
  });

  it("should create password form", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "password",
            label: "input element",
            required: false
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const input = form.querySelector("input");
    expect(input).toBeTruthy();
    expect(input.type).toBe("password");
    expect(input.required).toBe(false);
  });

  it("should create email form", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "email",
            label: "input element",
            required: false
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const input = form.querySelector("input");
    expect(input).toBeTruthy();
    expect(input.type).toBe("email");
    expect(input.required).toBe(false);
  });

  it("should create textarea form", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "message",
          type: "textarea",
          templateOptions: {
            label: "Message",
            rows: 8,
            required: false
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const input = form.querySelector("textarea");
    expect(input).toBeTruthy();
    expect(input.required).toBe(false);
  });

  it("should create multi form", () => {
    component.schema = {
      model: {
        input: "",
        password: "",
        email: ""
      },
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const inputs = form.querySelectorAll("input");
    expect(inputs[0]).toBeTruthy();
    expect(inputs[0].type).toBe("text");
    expect(inputs[0].required).toBe(false);
    expect(inputs[1]).toBeTruthy();
    expect(inputs[1].type).toBe("password");
    expect(inputs[1].required).toBe(false);
    expect(inputs[2]).toBeTruthy();
    expect(inputs[2].type).toBe("email");
    expect(inputs[2].required).toBe(false);
  });

  it("should create required input form", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const input = form.querySelector("input");
    expect(input).toBeTruthy();
    expect(input.type).toBe("text");
    expect(input.required).toBe(true);
  });

  it("should create required multi input form", () => {
    component.schema = {
      model: {
        input: "",
        password: "",
        email: ""
      },
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();

    const inputs = form.querySelectorAll("input");
    expect(inputs[0]).toBeTruthy();
    expect(inputs[0].type).toBe("text");
    expect(inputs[0].required).toBe(true);
    expect(inputs[1]).toBeTruthy();
    expect(inputs[1].type).toBe("password");
    expect(inputs[1].required).toBe(true);
    expect(inputs[2]).toBeTruthy();
    expect(inputs[2].type).toBe("email");
    expect(inputs[2].required).toBe(true);
  });

  it("should create form with title", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.title = "Title";
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h2");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Title");
  });

  it("should create form with subtitle", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.subTitle = "Sub Title";
    fixture.detectChanges();

    const subtitle = fixture.debugElement.nativeElement.querySelector("h6");
    expect(subtitle).toBeTruthy();
    expect(subtitle.innerText).toBe("Sub Title");
  });

  it("should create form with submit button label", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    expect(button).toBeTruthy();
    expect(button.innerText).toBe("Label");
  });

  it("should call submit function OnClick", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(() => {
      buttonPressed = true;
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBeTruthy();
  });

  it("should call submit function OnClick with user input", done => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.submitFunction.subscribe(data => {
      expect(data).toBeTruthy();
      expect(data).toEqual({ input: "user input" });
      done();
    });

    fixture.detectChanges();

    const input = fixture.debugElement.nativeElement.querySelector("input");
    input.value = "user input";
    input.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();
  });

  it("should not call submit function OnClick when required field is empty", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(() => {
      buttonPressed = true;
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBeFalsy();
  });

  it("should call submit function OnClick with filled required user input", done => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.submitFunction.subscribe(data => {
      expect(data).toBeTruthy();
      expect(data).toEqual({ input: "user input" });
      done();
    });

    fixture.detectChanges();

    const input = fixture.debugElement.nativeElement.querySelector("input");
    input.value = "user input";
    input.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();
  });

  it("should show error message when required field is empty OnSubmit", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(() => {
      buttonPressed = true;
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBeFalsy();

    const alert = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(alert).toBeTruthy();
    expect(alert.innerText).toContain("Please fill all required fields.");
  });

  it("should highlight missing field when required field is empty OnSubmit", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true
          }
        }
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(() => {
      buttonPressed = true;
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBeFalsy();

    const input = fixture.debugElement.nativeElement.querySelector("input");
    const hint = fixture.debugElement.nativeElement.querySelector(
      "div.invalid-feedback"
    );

    expect(input).toBeTruthy();
    expect(input.classList.value).toContain("is-invalid");
    expect(hint).toBeTruthy();
  });

  it("should highlight multiple missing fields when required fields are empty OnSubmit", () => {
    component.schema = {
      model: {
        input: ""
      },
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(() => {
      buttonPressed = true;
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBeFalsy();

    const inputs = fixture.debugElement.nativeElement.querySelectorAll("input");
    const hints = fixture.debugElement.nativeElement.querySelectorAll(
      "div.invalid-feedback"
    );

    expect(inputs[0].classList.value).toContain("is-invalid");
    expect(inputs[1].classList.value).toContain("ng-valid");
    expect(inputs[2].classList.value).toContain("is-invalid");
    expect(hints.length).toBe(2);
  });

  it("should show custom error message", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.error = "Custom Error";

    fixture.detectChanges();

    const alert = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(alert).toBeTruthy();
    expect(alert.innerText).toContain("Custom Error");
  });

  it("should update with custom error after submission", () => {
    component.schema = {
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
    component.submitLabel = "Label";
    component.submitLoading = false;
    component.submitFunction.subscribe(() => {
      component.error = "Custom Error";
    });

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    const alert = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(alert).toBeTruthy();
    expect(alert.innerText).toContain("Custom Error");
  });

  it("should handle custom expression", () => {
    component.schema = {
      model: {},
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    const inputs = form.querySelectorAll("input");

    expect(form).toBeTruthy();
    expect(inputs[0]).toBeTruthy();
    expect(inputs[0].type).toBe("password");
    expect(inputs[1]).toBeTruthy();
    expect(inputs[1].type).toBe("password");
  });

  it("should submit with correct custom expression", done => {
    component.schema = {
      model: {},
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
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

    const form = fixture.debugElement.nativeElement.querySelector("form");
    const inputs = form.querySelectorAll("input");

    inputs[0].value = "user input";
    inputs[0].dispatchEvent(new Event("input"));
    inputs[1].value = "user input";
    inputs[1].dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();
  });

  // TODO Fix this test or the form component
  xit("should not submit with bad response custom expression", () => {
    component.schema = {
      model: {},
      fields: [
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
      ]
    };
    component.submitLabel = "Label";
    component.submitLoading = false;
    let buttonPressed = false;
    component.submitFunction.subscribe(data => {
      buttonPressed = true;
    });
    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    const inputs = form.querySelectorAll("input");

    inputs[0].value = "user input";
    inputs[0].dispatchEvent(new Event("input"));
    inputs[1].value = "user input 2";
    inputs[1].dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    click(button);
    fixture.detectChanges();

    expect(buttonPressed).toBe(false);
  });

  it("should handle schemaUrl", () => {
    component.schemaUrl = `http://${window.location.host}/assets/tests/externalSchema.json`;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should request schemaUrl when given", () => {
    component.schemaUrl = `http://${window.location.host}/assets/tests/externalSchema.json`;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `http://${window.location.host}/assets/tests/externalSchema.json`
    );

    expect(req).toBeTruthy();
  });

  it("should create form with schemaUrl", () => {
    component.schemaUrl = `http://${window.location.host}/assets/tests/externalSchema.json`;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `http://${window.location.host}/assets/tests/externalSchema.json`
    );

    req.flush({
      model: {
        name: "",
        email: "",
        message: ""
      },
      fields: [
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
            required: true
          }
        }
      ]
    });

    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    expect(form).toBeTruthy();
  });

  it("should create inputs with schemaUrl", () => {
    component.schemaUrl = `http://${window.location.host}/assets/tests/externalSchema.json`;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `http://${window.location.host}/assets/tests/externalSchema.json`
    );

    req.flush({
      model: {
        name: "",
        email: "",
        message: ""
      },
      fields: [
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
            required: true
          }
        }
      ]
    });

    fixture.detectChanges();

    const form = fixture.debugElement.nativeElement.querySelector("form");
    const inputs = form.querySelectorAll("input");
    const textarea = form.querySelector("textarea");

    expect(inputs[0]).toBeTruthy();
    expect(inputs[0].type).toBe("text");
    expect(inputs[0].required).toBe(false);
    expect(inputs[1]).toBeTruthy();
    expect(inputs[1].type).toBe("email");
    expect(inputs[1].required).toBe(false);
    expect(textarea).toBeTruthy();
    expect(textarea.required).toBe(true);
  });
});
