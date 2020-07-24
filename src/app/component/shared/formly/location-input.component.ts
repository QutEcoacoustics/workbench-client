import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

/**
 * Timezone Input
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-timezone-input",
  template: `
    <div class="form-group">
      <label for="latitude">
        Latitude {{ field.templateOptions.required ? " *" : "" }}
      </label>
      <input
        id="latitude"
        type="number"
        [formlyAttributes]="field"
        [(ngModel)]="latitude"
        (ngModelChange)="validateValues()"
      />

      <label for="longitude">
        Longitude {{ field.templateOptions.required ? " *" : "" }}
      </label>
      <input
        id="longitude"
        type="number"
        [formlyAttributes]="field"
        [(ngModel)]="longitude"
        (ngModelChange)="validateValues()"
      />

      <input type="hidden" [id]="field.id" [formControl]="formControl" />
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyLocationInput extends FieldType {
  public latitude: number;
  public longitude: number;

  public validateValues() {
    console.log("Validating values", this.latitude, this.longitude);
  }
}
