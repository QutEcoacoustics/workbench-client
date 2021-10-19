import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { asFormControl } from "./helper";

/**
 * Image Input
 * ! Warning, test manually after changes
 */
@Component({
  selector: "baw-image-input",
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
          [formControl]="asFormControl(formControl)"
          [formlyAttributes]="field"
        />
      </div>
    </div>
  `,
})
export class ImageInputComponent extends FieldType {
  public asFormControl = asFormControl;
}
