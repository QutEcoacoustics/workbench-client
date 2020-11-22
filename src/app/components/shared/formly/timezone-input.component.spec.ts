import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule, FormlyTemplateOptions } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { FormlyTimezoneInput } from "./timezone-input.component";

// TODO Implement
describe("FormlyTimezoneInput", () => {
  let model: { timezone?: string };
  let formGroup: FormGroup;
  let spectator: SpectatorHost<FormlyTimezoneInput>;
  const createHost = createHostFactory({
    component: FormlyTimezoneInput,
    imports: [
      NgbModule,
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyRoot),
      FormlyBootstrapModule,
    ],
  });

  function getInput() {
    return spectator.query("input");
  }

  function setup(options: FormlyTemplateOptions = {}) {
    formGroup = new FormGroup({ timezone: new FormControl("") });
    model = {};

    spectator = createHost(
      `
      <form [formGroup]="formGroup">
        <formly-timezone-input></formly-timezone-input>
      </form>
      `,
      {
        hostProps: { formGroup },
        props: {
          field: {
            model,
            key: "timezone",
            formControl: formGroup.get("timezone"),
            templateOptions: options,
          },
        },
      }
    );
    spectator.detectChanges();
  }

  describe("label", () => {
    function getLabel() {
      return spectator.query("label");
    }

    it("should display label", () => {
      setup({ label: "custom label" });
      expect(getLabel().innerHTML.trim()).toBe("custom label");
    });

    it("should display required label", () => {
      setup({ label: "custom label", required: true });
      expect(getLabel().innerHTML.includes("*")).toBeTrue();
    });
  });

  xdescribe("input", () => {
    it("should ignore input until valid timezone selected", () => {});

    it("should display options on focus", () => {});

    it("should refine options based on input", () => {});

    it("should allow user to select option", () => {});
  });

  xdescribe("error handling", () => {
    it("should display error when required if input empty", () => {});

    it("should display error when invalid timezone input", () => {});
  });

  xdescribe("submission", () => {
    it("form should validate", () => {});

    it("should write timezone to model", () => {});
  });
});
