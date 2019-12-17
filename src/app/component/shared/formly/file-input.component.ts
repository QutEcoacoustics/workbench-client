import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-file-input",
  template: `
    <input type="file" [formControl]="formControl" [formlyAttributes]="field" />
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyFileInput extends FieldType {
  formControl: FormControl;
}
