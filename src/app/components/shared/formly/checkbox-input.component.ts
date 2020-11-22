import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

/**
 * Checkbox input using bootstrap to style the component
 * ! Warning, test manually after changes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FormlyCheckboxInput extends FieldType {
  public formControl: FormControl;
}
