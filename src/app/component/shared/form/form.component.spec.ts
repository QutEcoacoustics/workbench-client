import { HttpTestingController } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { FormComponent } from "./form.component";

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 },
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
  let defaultFields: FormlyFieldConfig[];
  let errorSpy: jasmine.Spy;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let notifications: ToastrService;

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
      imports: testFormImports,
      declarations: [FormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    notifications = TestBed.inject(ToastrService);

    errorSpy = spyOn(notifications, "error").and.stub();

    defaultFields = [
      {
        key: "input",
        type: "input",
        templateOptions: {
          label: "input element",
          required: false,
        },
      },
    ];
  });

  it("should create", () => {
    component.fields = defaultFields;
    component.submitLabel = "Label";
    component.submitLoading = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("Form Layout", () => {
    it("should create form", () => {
      component.fields = defaultFields;
      component.submitLabel = "Label";
      component.submitLoading = false;
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
    });

    it("should create form with title", () => {
      component.fields = defaultFields;
      component.submitLabel = "Label";
      component.submitLoading = false;
      component.title = "Title";
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Title");
    });

    it("should create form with subtitle", () => {
      component.fields = defaultFields;
      component.submitLabel = "Label";
      component.submitLoading = false;
      component.subTitle = "Sub Title";
      fixture.detectChanges();

      const subtitle = fixture.nativeElement.querySelector("h6");
      expect(subtitle).toBeTruthy();
      expect(subtitle.innerText).toContain("Sub Title");
    });

    it("should create form with submit button label", () => {
      component.fields = defaultFields;
      component.submitLabel = "Label";
      component.submitLoading = false;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector("button");
      expect(button).toBeTruthy();
      expect(button.innerText).toContain("Label");
    });
  });

  describe("Submit Button Type", () => {
    beforeEach(() => {
      component.fields = defaultFields;
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
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false,
          },
        },
      ];
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "text");
    });

    it("should create password form", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "password",
            label: "input element",
            required: false,
          },
        },
      ];
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "password");
    });

    it("should create email form", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            type: "email",
            label: "input element",
            required: false,
          },
        },
      ];
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "email");
    });

    it("should create textarea form", () => {
      component.fields = [
        {
          key: "message",
          type: "textarea",
          templateOptions: {
            label: "Message",
            rows: 8,
            required: false,
          },
        },
      ];
      fixture.detectChanges();

      const input = findInput("textarea");
      assertInput(input);
    });

    it("should create multi form", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false,
          },
        },
        {
          key: "password",
          type: "input",
          templateOptions: {
            type: "password",
            label: "password element",
            required: false,
          },
        },
        {
          key: "email",
          type: "input",
          templateOptions: {
            type: "email",
            label: "email element",
            required: false,
          },
        },
      ];
      fixture.detectChanges();

      const textInput = findInput(undefined, 0);
      const passwordInput = findInput(undefined, 1);
      const emailInput = findInput(undefined, 2);
      assertInput(textInput, "text");
      assertInput(passwordInput, "password");
      assertInput(emailInput, "email");
    });

    it("should create required input form", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
      fixture.detectChanges();

      const input = findInput();
      assertInput(input, "text", true);
    });

    it("should create required multi input form", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
        {
          key: "password",
          type: "input",
          templateOptions: {
            type: "password",
            label: "password element",
            required: true,
          },
        },
        {
          key: "email",
          type: "input",
          templateOptions: {
            type: "email",
            label: "email element",
            required: true,
          },
        },
      ];
      fixture.detectChanges();

      const textInput = findInput(undefined, 0);
      const passwordInput = findInput(undefined, 1);
      const emailInput = findInput(undefined, 2);
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
      component.submitFunction.subscribe((data) => {
        buttonPressed = true;
      });
      fixture.detectChanges();
    }

    it("should call submit function OnClick", () => {
      component.fields = defaultFields;
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeTruthy();
    });

    it("should call submit function OnClick with user input", (done) => {
      component.fields = defaultFields;
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe((data) => {
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
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(buttonPressed).toBeFalsy();
    });

    it("should call submit function OnClick with filled required user input", (done) => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
      // tslint:disable-next-line: rxjs-no-ignored-error
      component.submitFunction.subscribe((data) => {
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
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
      submit();

      const button = fixture.nativeElement.querySelector("button");
      click(button);
      fixture.detectChanges();

      expect(errorSpy).toHaveBeenCalledWith("Please fill all required fields.");
    });

    it("should highlight missing field when required field is empty OnSubmit", () => {
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
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
      component.fields = [
        {
          key: "input",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
        {
          key: "input2",
          type: "input",
          templateOptions: {
            label: "input element",
            required: false,
          },
        },
        {
          key: "input3",
          type: "input",
          templateOptions: {
            label: "input element",
            required: true,
          },
        },
      ];
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
  });

  // TODO Add tests for spinner
});
