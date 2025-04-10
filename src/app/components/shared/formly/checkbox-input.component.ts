import { Component } from "@angular/core";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { asFormControl } from "./helper";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/**
 * Checkbox input using bootstrap to style the component
 * ! Warning, test manually after changes
 */
@Component({
    selector: "baw-checkbox-input",
    template: `
    <div class="custom-control custom-checkbox ps-2">
      <input
        type="checkbox"
        class="custom-control-input"
        [id]="id + '-checkbox'"
        [formControl]="asFormControl(formControl)"
        [formlyAttributes]="field"
      />
      <label class="custom-control-label" [for]="id + '-checkbox'"></label>
    </div>
  `,
    styleUrl: "checkbox-input.component.scss",
    imports: [FormsModule, ReactiveFormsModule, FormlyModule]
})
export class CheckboxInputComponent extends FieldType {
  public asFormControl = asFormControl;
}
