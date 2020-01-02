import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-image-input",
  template: `
    <div class="form-group">
      <label *ngIf="field.templateOptions.label" [for]="field.id">
        {{
          field.templateOptions.label +
            (field.templateOptions.required ? " *" : "")
        }}
      </label>

      <div
        class="input-group"
        style="border: 1px solid #ced4da; border-radius: 0.25rem;"
      >
        <input
          type="file"
          accept="image/*"
          class="form-control"
          [formControl]="formControl"
          [formlyAttributes]="field"
        />
      </div>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyImageInput extends FieldType {
  formControl: FormControl;
}
