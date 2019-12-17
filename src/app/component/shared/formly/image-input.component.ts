import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-image-input",
  template: `
    <input
      type="file"
      accept="image/*"
      [formControl]="formControl"
      [formlyAttributes]="field"
    />
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyImageInput extends FieldType {
  formControl: FormControl;
}
