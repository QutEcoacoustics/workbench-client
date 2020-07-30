import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { createHostFactory, Spectator } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import {
  FormlyFormOptions,
  FormlyModule,
  FormlyTemplateOptions,
} from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { FormlyPasswordConfirmationInput } from "./password-confirmation-input.component";

describe("FormlyPasswordConfirmationInput", () => {
  let spectator: Spectator<FormlyPasswordConfirmationInput>;
  const createHost = createHostFactory({
    component: FormlyPasswordConfirmationInput,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyRoot),
      FormlyBootstrapModule,
    ],
  });

  function getInputs() {
    const divs = spectator.queryAll<HTMLDivElement>("div.form-group");
    return divs.map((div) => ({
      label: div.children[0] as HTMLLabelElement,
      input: div.children[1] as HTMLInputElement,
      error: div.children[2] as HTMLDivElement,
    }));
  }

  function getPasswordInput() {
    return getInputs()[0];
  }

  function getConfirmationInput() {
    return getInputs()[1];
  }

  function setup(options: FormlyTemplateOptions = {}) {
    const formGroup = new FormGroup({ confirmation: new FormControl("") });
    spectator = createHost(
      `
      <form [formGroup]="formGroup">
        <formly-password-confirmation-input></formly-password-confirmation-input>
      </form>
      `,
      {
        hostProps: { formGroup },
        props: {
          field: {
            key: "confirmation",
            formControl: formGroup.get("confirmation"),
            templateOptions: options,
          },
        },
      }
    );
    spectator.detectChanges();
  }

  describe("password", () => {
    beforeEach(() => {
      setup();
    });

    it("should create", () => {
      expect(getPasswordInput()).toBeTruthy();
    });

    it("should display label", () => {
      const label = getPasswordInput().label;
      expect(label.innerHTML.trim()).toBe("Password");
    });

    it("should display required symbol", () => {
      const label = getPasswordInput().label;
      expect(label.innerHTML.trim()).toBe("Password");
    });

    it("should display input", () => {
      const input = getPasswordInput().input;
      expect(input.type).toBe("password");
    });
  });

  describe("password confirmation", () => {
    beforeEach(() => {
      setup();
    });

    it("should create", () => {
      expect(getConfirmationInput()).toBeTruthy();
    });

    it("should display label", () => {
      const label = getConfirmationInput().label;
      expect(label.innerHTML.trim()).toBe("Password Confirmation");
    });

    it("should display input", () => {
      const input = getConfirmationInput().input;
      expect(input.type).toBe("password");
    });
  });

  describe("template options", () => {
    it("should display required symbol on password label", () => {
      setup({ required: true });
      const label = getPasswordInput().label;
      expect(label.innerHTML.includes("*")).toBeTruthy();
    });

    it("should display required symbol on confirmation label", () => {
      setup({ required: true });
      const label = getConfirmationInput().label;
      expect(label.innerHTML.includes("*")).toBeTruthy();
    });
  });

  describe("error messages", () => {
    it("should not initially display error on password field", () => {
      setup();
      const error = getPasswordInput().error;
      expect(error).toBeFalsy();
    });

    it("should not initially display error on confirmation field", () => {
      setup();
      const error = getConfirmationInput().error;
      expect(error).toBeFalsy();
    });

    describe("passwords must be 6 characters", () => {
      it("should display error if password less than 6 characters", () => {
        setup();
        const input = getPasswordInput().input;
        spectator.typeInElement("12345", input);
        spectator.detectChanges();

        const error = getPasswordInput().error;
        expect(error).toBeTruthy();
      });

      it("should not display error if password greater than or equal to 6 characters", () => {
        setup();
        const input = getPasswordInput().input;
        spectator.typeInElement("123456", input);
        spectator.detectChanges();

        const error = getPasswordInput().error;
        expect(error).toBeFalsy();
      });
    });

    describe("password matching", () => {
      it("should display error if passwords do not match", () => {
        setup();
        const passwordInput = getPasswordInput().input;
        const confirmationInput = getConfirmationInput().input;
        spectator.typeInElement("valid pass", passwordInput);
        spectator.typeInElement("invalid pass", confirmationInput);
        spectator.detectChanges();

        const error = getConfirmationInput().error;
        expect(error).toBeTruthy();
      });

      it("should not display error is passwords match", () => {
        setup();
        const passwordInput = getPasswordInput().input;
        const confirmationInput = getConfirmationInput().input;
        spectator.typeInElement("valid pass", passwordInput);
        spectator.typeInElement("valid pass", confirmationInput);
        spectator.detectChanges();

        const error = getConfirmationInput().error;
        expect(error).toBeFalsy();
      });
    });
  });
});
