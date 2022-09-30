import { Component, ViewChild, ElementRef } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { asFormControl } from "./helper";

/**
 * Image Input
 * ! Warning, test manually after changes
 */
@Component({
  selector: "baw-image-input",
  template: `
    <div class="form-group mb-3">
      <label *ngIf="props.label" [for]="field.id">
        {{ props.label + (props.required ? " *" : "") }}
      </label>

      <div
        class="input-group"
        style="border: 1px solid #ced4da; border-radius: 0.25rem;"
      >
        <!-- Ensure only one file can be selected in input -->
        <input
          #imageInput
          type="file"
          accept="image/*"
          class="form-control"
          [formControl]="asFormControl(formControl)"
          [formlyAttributes]="field"
          (ngModelChange)="readFile()"
        />

        <button
          type="button"
          (click)="removeImage()"
          class="btn btn-outline-danger"
        >Remove</button>
      </div>
    </div>
  `,
})
export class ImageInputComponent extends FieldType {
  @ViewChild("imageInput")
  public imageInput: ElementRef;
  public asFormControl = asFormControl;
  public readFile(): void {
    // File input returns a list of files, grab the first file and set it as
    // the value of this field
    const images = this.formControl.value;
    if (!(images instanceof FileList) || images.length === 0) {
      return;
    }

    // This should not be possible because only one file can be selected
    if (images.length !== 1) {
      // TODO Display error to user
      throw new Error(
        "File input returned multiple files. This should only return one value"
      );
    }

    this.formControl.setValue(images.item(0));
  }
  public removeImage(): void {
    this.model.image = null;
    this.imageInput.nativeElement.value = null;
  }
}
