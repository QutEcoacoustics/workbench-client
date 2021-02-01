import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { FieldType } from "@ngx-formly/core";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { List } from "immutable";

/**
 * Location Input
 * ! Warning, test manually after changes
 */
@Component({
  selector: "baw-location-input",
  template: `
    <div class="form-group">
      <label for="latitude"> Latitude {{ to.required ? " *" : "" }} </label>
      <input
        id="latitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': latitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="latitude"
        (ngModelChange)="updateModel()"
      />

      <div
        *ngIf="latitudeError"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ getError() }}
      </div>
    </div>

    <div class="form-group">
      <label for="longitude"> Longitude {{ to.required ? " *" : "" }} </label>
      <input
        id="longitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': longitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="longitude"
        (ngModelChange)="updateModel()"
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

    <div class="mb-3" style="height: 400px">
      <baw-map [markers]="marker"></baw-map>
    </div>
  `,
})
export class LocationInputComponent
  extends FieldType
  implements OnInit, AfterViewInit {
  public formControl: FormControl;
  public latitude: number;
  public latitudeError: boolean;
  public longitude: number;
  public longitudeError: boolean;
  public marker: List<MapMarkerOption>;

  public constructor(private map: MapService, private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {
    this.latitude = this.model["latitude"];
    this.longitude = this.model["longitude"];
    this.setMarker(this.latitude, this.longitude);
    this.formControl.setValidators(() => {
      const error = this.validateCoordinates();
      return error ? { [this.field.key.toString()]: error } : null;
    });
    this.formControl.updateValueAndValidity();
  }

  public ngAfterViewInit() {
    /*
     * This prevents the following error: ExpressionChangedAfterItHasBeenCheckedError
     * https://github.com/ngx-formly/ngx-formly/issues/2451
     */
    this.ref.detectChanges();
  }

  /**
   * Update hidden input
   */
  public updateModel() {
    this.formControl.setValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
    this.model["latitude"] = this.latitude;
    this.model["longitude"] = this.longitude;
    this.setMarker(this.latitude, this.longitude);
  }

  public getError(): string {
    return this.formControl.getError(this.field.key.toString());
  }

  /**
   * Set marker position
   *
   * @param latitude Latitude
   * @param longitude Longitude
   */
  private setMarker(latitude: number, longitude: number) {
    this.marker = this.map.sanitizeMarkers([
      {
        position: { lat: latitude, lng: longitude },
        label: `Position (${latitude},${longitude})`,
      },
    ]);
  }

  /**
   * Validate location values and return error if any
   */
  private validateCoordinates(): string {
    this.latitudeError = false;
    this.longitudeError = false;

    // XOR if latitude or longitude is set
    if (!isInstantiated(this.latitude)) {
      this.latitudeError = true;
      return "Both latitude and longitude must be set or left empty";
    } else if (!isInstantiated(this.longitude)) {
      this.longitudeError = true;
      return "Both latitude and longitude must be set or left empty";
    } else if (!this.map.isLatitudeValid(this.latitude)) {
      this.latitudeError = true;
      return "Latitude must be between -90 and 90";
    } else if (!this.map.isLongitudeValid(this.longitude)) {
      this.longitudeError = true;
      return "Longitude must be between -180 and 180";
    }
  }
}
