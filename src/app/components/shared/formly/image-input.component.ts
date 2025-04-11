import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { ImageUrl } from "@interfaces/apiInterfaces";
import { asFormControl } from "./helper";

/**
 * Image Input
 * ! Warning, test manually after changes
 */
@Component({
  selector: "baw-image-input",
  template: `
    <div class="form-group mb-3">
      @if (props.label) {
        <label [for]="field.id">
          {{ props.label + (props.required ? " *" : "") }}
        </label>
      }

      <div class="form-control input-group p-0">
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

        @if (!usesDefaultImage) {
          <button type="button" (click)="removeImage()" class="btn btn-outline-danger pb-1">Remove</button>
        }
      </div>
    </div>
  `,
  standalone: false,
})
export class ImageInputComponent extends FieldType implements AfterViewInit {
  @ViewChild("imageInput")
  public imageInput: ElementRef;
  public asFormControl = asFormControl;

  public ngAfterViewInit() {
    if (!this.usesDefaultImage) {
      const imageUrls = this.model.imageUrls as ImageUrl[];
      const currentImage = imageUrls && imageUrls[0];
      const imageFileName = this.fileName(currentImage?.url);

      // if the current model has a different image to the default image, display the name of the file in the image input
      // for security reasons, modern web browsers don't allow changing a file inputs value directly
      // because of this we need to use a data transfer which is performed in "protected mode"
      // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([""], imageFileName));
      this.imageInput.nativeElement.files = dataTransfer.files;
    }
  }

  /**
   * A predicate that returns if the models image is a default image
   */
  public get usesDefaultImage(): boolean {
    const imageUrls = this.model?.imageUrls as ImageUrl[];
    const isUsingServerDefaultImage = imageUrls?.every((image: ImageUrl): boolean => image.default);

    // returns true if the current image used is a default image and if the user hasn't redefined the image
    // or returns true if the user explicitly sets the image as default, by setting the models image attribute to null
    return (isUsingServerDefaultImage && this.model.image === undefined) || this.model.image === null;
  }

  private fileName(filePath: string): string {
    return (
      filePath
        ?.split("/")
        .pop()
        // remove URL parameters from the file name
        .split("?")
        .shift()
    );
  }

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
      throw new Error("File input returned multiple files. This should only return one value");
    }

    this.formControl.setValue(images.item(0));
  }

  public removeImage(): void {
    this.model.image = null;
    this.imageInput.nativeElement.value = null;
  }
}
