import { Component, OnInit } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { FieldType } from "@ngx-formly/core";

/**
 * Location Input
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-location-input",
  template: `
    <div class="form-group">
      <label for="latitude">
        Latitude {{ field.templateOptions.required ? " *" : "" }}
      </label>
      <input
        id="latitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': latitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="latitude"
        (ngModelChange)="updateValue()"
      />

      <div
        *ngIf="latitudeError"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ getError() }}
      </div>

      <label for="longitude">
        Longitude {{ field.templateOptions.required ? " *" : "" }}
      </label>
      <input
        id="longitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': longitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="longitude"
        (ngModelChange)="updateValue()"
      />

      <div
        *ngIf="longitudeError"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ getError() }}
      </div>

      <input type="hidden" [id]="field.id" [formControl]="formControl" />
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyLocationInput extends FieldType implements OnInit {
  public latitude: number;
  public latitudeError: boolean;
  public longitude: number;
  public longitudeError: boolean;

  public ngOnInit() {
    this.latitude = this.model["latitude"];
    this.longitude = this.model["longitude"];
    this.formControl.setValidators(() => {
      const error = this.validateValues();
      return error ? { [this.field.key]: error } : null;
    });
    this.formControl.updateValueAndValidity();
  }

  /**
   * Update hidden input
   */
  public updateValue() {
    this.formControl.setValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
    this.model["latitude"] = this.latitude;
    this.model["longitude"] = this.longitude;
  }

  public getError(): string {
    return this.formControl.getError(this.field.key);
  }

  /**
   * Validate location values and return error if any
   */
  private validateValues(): string {
    this.latitudeError = false;
    this.longitudeError = false;

    // XOR if latitude or longitude is set
    if (!isInstantiated(this.latitude) !== !isInstantiated(this.longitude)) {
      this.latitudeError = !isInstantiated(this.latitude);
      this.longitudeError = !isInstantiated(this.longitude);
      return "Both latitude and longitude must be set or left empty";
    } else if (this.latitude < -90 || this.latitude > 90) {
      this.latitudeError = true;
      return "Latitude must be between -90 and 90";
    } else if (this.longitude < -180 || this.longitude > 180) {
      this.longitudeError = true;
      return "Longitude must be between -180 and 180";
    }
  }
}
