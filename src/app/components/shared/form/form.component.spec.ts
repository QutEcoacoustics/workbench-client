import { BawSessionService } from "@baw-api/baw-session.service";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { noop } from "rxjs";
import { FormComponent, SchemaConfig } from "./form.component";

describe("FormComponent", () => {
  let defaultFields: FormlyFieldConfig[];
  let toastr: ToastrService;
  let spec: SpectatorHost<FormComponent>;
  const createComponent = createHostFactory({
    component: FormComponent,
    providers: [BawSessionService],
    imports: testFormImports,
  });

  function getSubmitButton(): HTMLButtonElement {
    return spec.query<HTMLButtonElement>("button");
  }

  function findInput(
    selector: string = "input",
    position: number = 0
  ): HTMLElement {
    return spec.queryAll<HTMLElement>("form " + selector)[position];
  }

  function assertInput(input: any, type?: string, required?: boolean) {
    expect(input).toBeTruthy();
    expect(input.required).toBe(required ? required : false);

    if (type) {
      expect(input.type).toBe(type);
    }
  }

  function createInputField(
    type?: string,
    required?: boolean,
    opts?: { key?: string; label?: string }
  ): SchemaConfig {
    return {
      key: opts?.key ?? "input",
      type: "input",
      templateOptions: {
        label: opts?.label ?? "input element",
        type,
        required,
      },
    };
  }

  function createTextareaField(required?: boolean) {
    return {
      key: "message",
      type: "textarea",
      templateOptions: {
        label: "Message",
        rows: 8,
        required,
      },
    };
  }

  function setup(props?: Partial<FormComponent>): void {
    const propInputs = Object.entries(props)
      .map(([key, _]) => `[${key}]="${key}"`)
      .join(" ");

    spec = createComponent(`<baw-form ${propInputs}></baw-form>`, {
      detectChanges: false,
      hostProps: props,
    });
    toastr = spec.inject(ToastrService);

    spyOn(toastr, "success").and.stub();
    spyOn(toastr, "error").and.stub();
  }

  beforeEach(() => {
    defaultFields = [
      {
        key: "input",
        type: "input",
        templateOptions: { label: "input element", required: false },
      },
    ];
  });

  it("should create", () => {
    setup({ fields: defaultFields });
    spec.detectChanges();
    expect(spec.component).toBeInstanceOf(FormComponent);
  });

  describe("Form Layout", () => {
    it("should create form", () => {
      setup({ fields: defaultFields });
      spec.detectChanges();
      expect(spec.query("form")).toBeInstanceOf(HTMLFormElement);
    });

    it("should create form with title", () => {
      setup({ title: "Title" });
      spec.detectChanges();
      expect(spec.query("h2")).toContainText("Title");
    });

    it("should create form with subtitle", () => {
      setup({ subTitle: "Sub Title" });
      spec.detectChanges();
      expect(spec.query("h6")).toContainText("Sub Title");
    });

    it("should create form with submit button label", () => {
      setup({ submitLabel: "Submit Label" });
      spec.detectChanges();
      expect(getSubmitButton()).toContainText("Submit Label");
    });
  });

  describe("Submit Button Type", () => {
    function assertSubmit(className: string) {
      const submit = spec.query("button[type='submit']");
      expect(submit).toBeTruthy();
      expect(submit).toHaveClass(className);
    }

    it("should create form with default submit button", () => {
      setup({ submitLabel: "label" });
      spec.detectChanges();
      assertSubmit("btn-primary");
    });

    const types: BootstrapColorTypes[] = [
      "danger",
      "dark",
      "info",
      "light",
      "primary",
      "secondary",
      "success",
      "warning",
    ];
    types.forEach((type) => {
      it(`should create form with ${type} submit button`, () => {
        setup({ btnColor: type, submitLabel: "label" });
        spec.detectChanges();
        assertSubmit(`btn-${type}`);
      });
    });
  });

  describe("Input Types", () => {
    // Tests all input types and textareas, whether required or not
    [true, false].forEach((isRequired) => {
      ["text", "password", "email"].forEach((type) => {
        it(`should create ${isRequired ? "required " : ""}${type} form`, () => {
          setup({ fields: [createInputField(type, isRequired)] });
          spec.detectChanges();
          assertInput(findInput(), type, isRequired);
        });
      });

      it(`should create ${isRequired ? "required " : ""}textarea form`, () => {
        setup({ fields: [createTextareaField(isRequired)] });
        spec.detectChanges();
        assertInput(findInput("textarea"), undefined, isRequired);
      });
    });

    it("should create multi form", () => {
      setup({
        fields: [
          createInputField("text"),
          createInputField("password"),
          createInputField("email"),
        ],
      });
      spec.detectChanges();
      assertInput(findInput(undefined, 0), "text");
      assertInput(findInput(undefined, 1), "password");
      assertInput(findInput(undefined, 2), "email");
    });

    it("should create required multi input form", () => {
      setup({
        fields: [
          createInputField("text", true),
          createInputField("password", true),
          createInputField("email", true),
        ],
      });
      spec.detectChanges();
      assertInput(findInput(undefined, 0), "text", true);
      assertInput(findInput(undefined, 1), "password", true);
      assertInput(findInput(undefined, 2), "email", true);
    });
  });

  describe("Submit", () => {
    let buttonPressed: boolean;

    function getHints() {
      return spec.queryAll("div.invalid-feedback");
    }

    function getInputs() {
      return spec.queryAll<HTMLInputElement>("input");
    }

    function submit() {
      buttonPressed = false;
      spec.component.submit.subscribe(() => (buttonPressed = true), noop);
      spec.detectChanges();
    }

    it("should call submit function OnClick", () => {
      setup({ submitLabel: "label", fields: defaultFields });
      submit();
      spec.click(getSubmitButton());
      spec.detectChanges();
      expect(buttonPressed).toBeTruthy();
    });

    it("should call submit function OnClick with user input", (done) => {
      setup({ submitLabel: "label", fields: defaultFields });
      spec.component.submit.subscribe((data) => {
        expect(data).toEqual({ input: "user input" });
        done();
      }, noop);
      spec.detectChanges();

      spec.typeInElement("user input", getInputs()[0]);
      spec.click(getSubmitButton());
      spec.detectChanges();
    });

    it("should not call submit function OnClick when required field is empty", () => {
      setup({ submitLabel: "label", fields: [createInputField("text", true)] });
      submit();
      spec.click(getSubmitButton());
      spec.detectChanges();
      expect(buttonPressed).toBeFalsy();
    });

    it("should call submit function OnClick with filled required user input", (done) => {
      setup({ submitLabel: "label", fields: [createInputField("text", true)] });
      spec.component.submit.subscribe((data) => {
        expect(data).toEqual({ input: "user input" });
        done();
      }, noop);
      spec.detectChanges();

      spec.typeInElement("user input", getInputs()[0]);
      spec.click(getSubmitButton());
      spec.detectChanges();
    });

    it("should show error message when required field is empty OnSubmit", () => {
      setup({ submitLabel: "label", fields: [createInputField("text", true)] });
      submit();
      spec.click(getSubmitButton());
      spec.detectChanges();
      expect(toastr.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    });

    it("should highlight missing field when required field is empty OnSubmit", () => {
      setup({ submitLabel: "label", fields: [createInputField("text", true)] });
      submit();
      spec.click(getSubmitButton());
      spec.detectChanges();
      expect(getInputs()[0]).toHaveClass("is-invalid");
      expect(getHints()[0]).toBeTruthy();
    });

    it("should highlight multiple missing fields when required fields are empty OnSubmit", () => {
      setup({
        submitLabel: "label",
        fields: [
          createInputField("text", true, { key: "input1" }),
          createInputField("text", false, { key: "input2" }),
          createInputField("text", true, { key: "input3" }),
        ],
      });
      submit();
      spec.click(getSubmitButton());
      spec.detectChanges();

      const inputs = getInputs();
      expect(inputs[0]).toHaveClass("is-invalid");
      expect(inputs[1]).toHaveClass("ng-valid");
      expect(inputs[2]).toHaveClass("is-invalid");
      expect(getHints().length).toBe(2);
    });
  });

  // TODO Add tests for recaptcha
  xdescribe("Recaptcha", () => {
    it("should disable submit button while loading recaptcha seed", () => {});
    it("should re-enable submit button when recaptcha seed loaded", () => {});
    it("should display error notification if recaptcha fails to load", () => {});
    it("should insert recaptcha token into model on submit", () => {});
  });

  // TODO Add tests for spinner
  // TODO Add test for subTitle html input
});
