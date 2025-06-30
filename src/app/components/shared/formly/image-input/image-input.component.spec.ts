import { FormControl, FormGroup } from "@angular/forms";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyFieldProps } from "@ngx-formly/core";
import { inputFile } from "@test/helpers/html";
import { testFormProviders } from "@test/helpers/testbed";
import { modelData } from "@test/helpers/faker";
import { ImageInputComponent } from "./image-input.component";

describe("FormlyImageInput", () => {
  let spec: SpectatorHost<ImageInputComponent>;

  let model: any;
  let formGroup: FormGroup;

  const createHost = createHostFactory({
    component: ImageInputComponent,
    providers: testFormProviders,
  });

  function getInput() {
    return spec.query<HTMLInputElement>("input[type='file']");
  }

  function removeButton() {
    return spec.query<HTMLButtonElement>("button");
  }

  function setup(options: FormlyFieldProps = {}) {
    const key = "file";

    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = {
      image: "",
      imageUrls: modelData.imageUrls(),
    };

    const hostTemplate = `
      <form [formGroup]="formGroup">
        <baw-image-input [field]="field"></baw-image-input>
      </form>
    `;

    spec = createHost(hostTemplate, {
      hostProps: {
        formGroup,
        field: {
          model,
          key,
          formControl: formGroup.get("asFormControl"),
          props: options,
        },
      },
    });
    spec.detectChanges();
  }

  describe("imageInput", () => {
    it("should display file input", () => {
      setup();
      expect(getInput()).toExist();
    });
  });

  describe("removeImage", () => {
    it("should display the remove image button if the model has an image", () => {
      setup();
      // project_span4.png is the file name of the project default image
      // if this test is not passing, it may be because the condition for the remove
      // image button is dependent on the file name
      model.image = new File([""], "project_span4.png");
      spec.detectChanges();

      expect(removeButton()).toExist();
    });

    it("should not display remove image button if the model does not have an image", () => {
      setup();
      model.image = null;
      spec.detectChanges();

      expect(removeButton()).not.toExist();
    });

    it("should not display remove image button once the button has been clicked", () => {
      setup();
      spec.click(removeButton());
      expect(removeButton()).not.toExist();
    });

    it("should set model value to null on click", () => {
      setup();
      removeButton().click();
      expect(model.image).toBeNull();
    });

    it("should remove file from image input field", () => {
      setup();
      const imageInput = getInput();

      const testingFile = new File([""], "testFile.png");
      inputFile(spec, imageInput, [testingFile]);

      spec.click(removeButton());
      expect(imageInput.value).toBeFalsy();
    });
  });
});
