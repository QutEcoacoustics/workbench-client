import { Component, OnInit } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { asFormControl } from "./helper";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapComponent } from "../map/map.component";

/**
 * Location Input
 * ! Warning, test manually after changes
 * Modifying the location through map clicks and drag are not fully tested through the unit tests and should be tested manually
 */
@Component({
    selector: "baw-location-input",
    template: `
    <div class="form-group">
      <label for="latitude"> Latitude {{ props.required ? " *" : "" }} </label>
      <input
        id="latitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': latitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="latitude"
        (ngModelChange)="updateModel()"
      />

      @if (latitudeError) {
        <div class="invalid-feedback" style="display: block;">
          {{ getError() }}
        </div>
      }
    </div>

    <div class="form-group">
      <label for="longitude">
        Longitude {{ props.required ? " *" : "" }}
      </label>
      <input
        id="longitude"
        type="number"
        class="form-control"
        [class]="{ 'is-invalid': longitudeError }"
        [formlyAttributes]="field"
        [(ngModel)]="longitude"
        (ngModelChange)="updateModel()"
      />

      @if (longitudeError) {
        <div class="invalid-feedback" style="display: block;">
          {{ getError() }}
        </div>
      }

      <input
        type="hidden"
        [id]="field.id"
        [formControl]="asFormControl(formControl)"
      />
    </div>

    <div class="mb-3" style="height: 400px">
      <baw-map
        [markers]="marker"
        [markerOptions]="{ draggable: true }"
        (newLocation)="updateModel($event.latLng.lng(), $event.latLng.lat())"
      ></baw-map>
    </div>
  `,
    imports: [FormsModule, FormlyModule, ReactiveFormsModule, MapComponent]
})
export class LocationInputComponent extends FieldType implements OnInit {
  public asFormControl = asFormControl;
  public latitude: number;
  public latitudeError: boolean;
  public longitude: number;
  public longitudeError: boolean;
  public marker: List<MapMarkerOptions>;

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

  /**
   * Update hidden input
   */
  public updateModel(longitude?: number, latitude?: number) {
    this.latitude = latitude ?? this.latitude;
    this.longitude = longitude ?? this.longitude;

    this.formControl.setValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });

    this.model["latitude"] = this.latitude;
    this.model["longitude"] = this.longitude;
    this.model["customLatitude"] = this.latitude;
    this.model["customLongitude"] = this.longitude;

    this.setMarker(this.latitude, this.longitude);
  }

  public getError(): string {
    return this.formControl.getError(this.field.key.toString());
  }

  /**
   * Set marker position, or set to null if lat/lng missing
   *
   * @param latitude Latitude
   * @param longitude Longitude
   */
  private setMarker(latitude: number, longitude: number) {
    this.marker = sanitizeMapMarkers(
      isInstantiated(latitude) && isInstantiated(longitude)
        ? {
            position: { lat: latitude, lng: longitude },
            label: `Position (${latitude},${longitude})`,
          }
        : null,
    );
  }

  /**
   * Validate location values and return error if any
   */
  private validateCoordinates(): string {
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
