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
          (ngModelChange)="readFile()"
        />
      </div>
    </div>
  `,
})
export class ImageInputComponent extends FieldType {
  public asFormControl = asFormControl;
  public readFile(): void {
    // File input returns a list of files, grab the first file and set it as
    // the value of this field
    const imageFiles = this.formControl.value;
    if (imageFiles instanceof FileList && imageFiles.length > 0) {
      this.formControl.setValue(imageFiles.item(0));
    }
  }
}
