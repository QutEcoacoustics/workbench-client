import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { ImageUrl } from "@interfaces/apiInterfaces";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { asFormControl } from "../helper";
import { FileValueAccessorDirective } from "../file-input/file-input.directive";

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
          <button
            type="button"
            (click)="removeImage()"
            class="btn btn-outline-danger pb-1"
          >
            Remove
          </button>
        }
      </div>
    </div>
  `,
  imports: [
    FileValueAccessorDirective,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
  ],
})
export class ImageInputComponent extends FieldType implements AfterViewInit {
  @ViewChild("imageInput")
  public imageInput: ElementRef;
  public asFormControl = asFormControl;

  /**
   * A predicate that returns if the models image is a default image, or if the
   * model has not been instantiated.
   * The model can be "undefined" during model creation.
   * (e.g. the "new project" form)
   */
  protected get usesDefaultImage(): boolean {
    const imageUrls = this.model?.imageUrls;

    // Note that the "imageUrls" property can only be set by the server.
    // If the client wants to change / set the image of a model, it will use the
    // "image" property.
    //
    // Therefore, if the "imageUrls" property is not defined, the model we are
    // working with did not originate from the server and will therefore use the
    // default image if the user hasn't explicitly set an image on the client.
    const isUsingServerDefaultImage =
      !imageUrls ||
      imageUrls.every((image: ImageUrl): boolean => image.default);

    // Return true if:
    //
    // 1. The current image is a default image and the user hasn't uploaded a
    //    new replacement image.
    //
    // 2. We are using the default image because the user has explicitly set the
    //    image property to "null".
    return (
      (isUsingServerDefaultImage && this.model.image === undefined) ||
      this.model.image === null
    );
  }

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

  protected readFile(): void {
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
        "File input returned multiple files. This should only return one value",
      );
    }

    this.formControl.setValue(images.item(0));
  }

  protected removeImage(): void {
    this.model.image = null;
    this.imageInput.nativeElement.value = null;
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
}
