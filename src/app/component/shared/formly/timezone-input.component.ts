import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-timezone-input",
  template: `
    <div class="form-group">
      <label *ngIf="field.templateOptions.label" [for]="field.id">
        {{
          field.templateOptions.label +
            (field.templateOptions.required ? " *" : "")
        }}
      </label>

      <div class="input-group">
        <input
          type="text"
          class="form-control"
          [formControl]="formControl"
          [formlyAttributes]="field"
        />
        <div class="input-group-append">
          <div class="input-group-text">(no match)</div>
        </div>
      </div>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType {
  formControl: FormControl;
}
