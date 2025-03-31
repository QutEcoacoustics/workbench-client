import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { inputFile } from "@test/helpers/html";
import { ImageInputComponent } from "./image-input.component";
import { formlyConfig } from "./custom-inputs.module";

describe("FormlyImageInput", () => {
  let spectator: SpectatorHost<ImageInputComponent>;

  let model: any;
  let formGroup: FormGroup;

  const createHost = createHostFactory({
    component: ImageInputComponent,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
    ],
  });

  function getInput() {
    return spectator.query<HTMLInputElement>("input[type='file']");
  }

  function getButton() {
    return spectator.query<HTMLButtonElement>("button");
  }

  function setup(options: FormlyFieldProps = {}) {
    const key = "file";

    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = {
      image: "",
      imageUrls: [],
    };

    const hostTemplate = `
      <form [formGroup]="formGroup">
        <baw-image-input></baw-image-input>
      </form>
    `;

    spectator = createHost(hostTemplate, {
      hostProps: { formGroup },
      props: {
        field: {
          model,
          key,
          formControl: formGroup.get("asFormControl"),
          props: options,
        },
      },
    });
    spectator.detectChanges();
  }

  describe("imageInput", () => {
    it("should display file input", () => {
      setup();
      expect(getInput()).toBeTruthy();
    });
  });

  describe("removeImage", () => {
    it("should display the remove image button if the model has an image", () => {
      setup();
      // project_span4.png is the file name of the project default image
      // if this test is not passing, it may be because the condition for the remove
      // image button is dependent on the file name
      model.image = new File([""], "project_span4.png");
      spectator.detectChanges();

      expect(getButton()).toBeTruthy();
    });

    it("should not display remove image button if the model does not have an image", () => {
      setup();
      model.image = null;
      spectator.detectChanges();

      expect(getButton()).toBeNull();
    });

    it("should not display remove image button once the button has been clicked", () => {
      setup();
      expect(getButton()).toBeTruthy();

      getButton().click();
      spectator.detectChanges();

      expect(getButton()).toBeNull();
    });

    it("should set model value to null on click", () => {
      setup();
      getButton().click();
      expect(model.image).toBeNull();
    });

    it("should remove file from image input field", () => {
      setup();
      const imageInput = getInput();

      const testingFile = new File([""], "testFile.png");
      inputFile(spectator, imageInput, [testingFile]);

      getButton().click();
      expect(imageInput.value).toBeFalsy();
    });
  });
});
