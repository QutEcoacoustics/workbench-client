import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-checkbox-input",
  template: `
    <div
      style="width: 24px;"
      class="custom-control custom-checkbox col-form-label"
    >
      <input
        type="checkbox"
        class="custom-control-input"
        [id]="id + '-checkbox'"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label class="custom-control-label" [for]="id + '-checkbox'"></label>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyCheckboxInput extends FieldType {
  formControl: FormControl;
}
