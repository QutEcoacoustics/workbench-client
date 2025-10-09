import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { MapComponent, sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
import { MapMarkerOptions, MapsService } from "@services/maps/maps.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { asFormControl } from "../helper";

/**
 * Location input where the user can type in longitude and latitude coordinates
 * or drag a marker on a map.
 *
 * ! Warning, test manually after changes
 * Modifying the location through map clicks and drag are not fully tested
 * through the unit tests and should be tested manually.
 */
@Component({
  selector: "baw-location-input",
  templateUrl: "./location-input.component.html",
  imports: [FormsModule, FormlyModule, ReactiveFormsModule, MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationInputComponent extends FieldType implements OnInit {
  private readonly mapsService = inject(MapsService);

  protected readonly asFormControl = asFormControl;
  protected readonly marker = signal<List<MapMarkerOptions> | null>(null);

  protected readonly latitude = signal<number | undefined>(undefined);
  protected readonly latitudeError = signal(false);

  protected readonly longitude = signal<number | undefined>(undefined);
  protected readonly longitudeError = signal(false);

  public ngOnInit() {
    this.latitude.set(this.model["latitude"]);
    this.longitude.set(this.model["longitude"]);

    this.formControl.setValidators(() => {
      const error = this.validateCoordinates();
      return error ? { [this.field.key.toString()]: error } : null;
    });
    this.formControl.updateValueAndValidity();

    this.setMarker(this.latitude(), this.longitude());
  }

  /**
   * Update hidden input
   */
  public updateModel(latitude?: number, longitude?: number) {
    // These !== undefine checks allow setting the longitude and/or latitude to
    // null, indicating that the value has been removed.
    if (latitude !== undefined) {
      this.latitude.set(latitude);
    }

    if (longitude !== undefined) {
      this.longitude.set(longitude);
    }

    this.formControl.setValue({
      latitude: this.latitude(),
      longitude: this.longitude(),
    });

    this.model["latitude"] = this.latitude();
    this.model["longitude"] = this.longitude();
    this.model["customLatitude"] = this.latitude();
    this.model["customLongitude"] = this.longitude();

    this.setMarker(this.latitude(), this.longitude());
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
  private async setMarker(latitude: number, longitude: number) {
    // If the map has not been initialized yet, wait for it to load
    // before setting the marker.
    await this.mapsService.loadAsync();

    const markers = sanitizeMapMarkers(
      isInstantiated(latitude) && isInstantiated(longitude)
        ? new google.maps.marker.AdvancedMarkerElement({
            position: { lat: latitude, lng: longitude },
            title: `Position (${latitude},${longitude})`,
          })
        : null,
    );

    this.marker.set(markers);
  }

  /**
   * Validate location values and return error if any
   */
  private validateCoordinates(): string {
    this.latitudeError.set(false);
    this.longitudeError.set(false);

    // XOR if latitude or longitude is set
    if (!isInstantiated(this.latitude()) !== !isInstantiated(this.longitude())) {
      this.latitudeError.set(!isInstantiated(this.latitude()));
      this.longitudeError.set(!isInstantiated(this.longitude()));
      return "Both latitude and longitude must be set or left empty";
    } else if (this.latitude() < -90 || this.latitude() > 90) {
      this.latitudeError.set(true);
      return "Latitude must be between -90 and 90";
    } else if (this.longitude() < -180 || this.longitude() > 180) {
      this.longitudeError.set(true);
      return "Longitude must be between -180 and 180";
    }
  }
}
