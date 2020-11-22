import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

/**
 * Image Input
 * ! Warning, test manually after changes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "formly-image-input",
  template: `
    <div class="form-group">
      <label *ngIf="to.label" [for]="field.id">
        {{ to.label + (to.required ? " *" : "") }}
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
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FormlyImageInput extends FieldType {
  public formControl: FormControl;
}
