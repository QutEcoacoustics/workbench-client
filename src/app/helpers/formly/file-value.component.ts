import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-field-file",
  template: `
    <input type="file" [formControl]="formControl" [formlyAttributes]="field" />
  `
})
export class FormlyFieldFileComponent extends FieldType {}
