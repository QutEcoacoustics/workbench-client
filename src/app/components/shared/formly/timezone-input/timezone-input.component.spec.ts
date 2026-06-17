import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { formlyConfig } from "../custom-inputs.module";
import { TimezoneInputComponent } from "./timezone-input.component";

// TODO Implement
describe("FormlyTimezoneInput", () => {
  let model: { timezone?: string };
  let formGroup: FormGroup;
  let spec: SpectatorHost<TimezoneInputComponent>;

  const createHost = createHostFactory({
    component: TimezoneInputComponent,
    imports: [
      NgbModule,
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
    ],
  });

  function setup(props: FormlyFieldProps = {}) {
    formGroup = new FormGroup({ timezone: new FormControl("") });
    model = {};

    spec = createHost(
      `
      <form [formGroup]="formGroup">
        <baw-timezone-input [field]="field"></baw-timezone-input>
      </form>
    `,
      {
        hostProps: {
          formGroup,
          field: {
            model,
            key: "timezone",
            formControl: formGroup.get("timezone"),
            props,
          },
        },
      },
    );
    spec.detectChanges();
  }

  describe("label", () => {
    function getLabel() {
      return spec.query("label");
    }

    it("should display label", () => {
      setup({ label: "custom label" });
      expect(getLabel()!.innerHTML.trim()).toBe("custom label");
    });

    it("should display required label", () => {
      setup({ label: "custom label", required: true });
      expect(getLabel()!.innerHTML.includes("*")).toBeTrue();
    });
  });

  xdescribe("input", () => {
    it("should ignore input until valid timezone selected", () => {
      pending();
    });

    it("should display options on focus", () => {
      pending();
    });

    it("should refine options based on input", () => {
      pending();
    });

    it("should allow user to select option", () => {
      pending();
    });
  });

  xdescribe("error handling", () => {
    it("should display error when required if input empty", () => {
      pending();
    });

    it("should display error when invalid timezone input", () => {
      pending();
    });
  });

  xdescribe("submission", () => {
    it("form should validate", () => {
      pending();
    });

    it("should write timezone to model", () => {
      pending();
    });
  });
});
