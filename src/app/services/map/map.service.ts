import { Injectable } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";

enum MapState {
  loading = 0,
  success = 1,
  failure = 2,
}

/**
 * Map Service for Google Maps Wrapper. This prevents the google maps
 * api bundle being inserted into the application multiple times.
 * This service is a mixture of resources given by:
 * https://github.com/angular/components/tree/master/src/google-maps
 * https://developers.google.com/maps/documentation/javascript/overview#Loading_the_Maps_API
 * https://github.com/googlemaps/js-api-loader/blob/master/src/index.ts
 */
@Injectable({ providedIn: "root" })
export class MapService extends withUnsubscribe() {
  /**
   * Current state of google maps api bundle download (loading/success/failure)
   */
  public static mapState = MapState;
  private static mapUrl = "https://maps.googleapis.com/maps/api/js";

  /**
   * Is google maps api bundle loaded
   */
  public isMapLoaded$ = new BehaviorSubject<MapState>(MapState.loading);

  public constructor(private config: ConfigService) {
    super();
    this.loadMap();
  }

  /**
   * Is google maps api bundle loaded
   */
  public get isMapLoaded(): MapState {
    return this.isMapLoaded$.getValue();
  }

  /**
   * Get google namespace safely
   */
  public get google(): typeof google {
    if (!this.isMapLoaded) {
      return undefined;
    }

    try {
      return google;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Determine if a map marker is valid
   */
  public isMarkerValid(marker: MapMarkerOption): boolean {
    const latitude = marker?.position?.lat;
    const longitude = marker?.position?.lng;
    return this.isLatitudeValid(latitude) && this.isLongitudeValid(longitude);
  }

  /**
   * Determine if a latitude value is valid
   *
   * @param latitude Latitude coordinate
   */
  public isLatitudeValid(latitude: any) {
    if (typeof latitude !== "number") {
      return false;
    }
    return latitude >= -90 && latitude <= 90;
  }

  /**
   * Determine if a longitude value is valid
   *
   * @param longitude Longitude coordinate
   */
  public isLongitudeValid(longitude: any) {
    if (typeof longitude !== "number") {
      return false;
    }
    return longitude >= -180 && longitude <= 180;
  }

  /**
   * Sanitize array of map markers so that undefined, or invalid map markers
   * are not send to the google maps component
   */
  public sanitizeMarkers(markers: MapMarkerOption[]): List<MapMarkerOption> {
    return List((markers ?? []).filter((marker) => this.isMarkerValid(marker)));
  }

  /**
   * Load google maps bundle
   */
  protected loadMap() {
    const apiKey = this.config.environment.keys.googleMaps;
    let mapsUrl = MapService.mapUrl;

    if (apiKey) {
      // Only add api key if it exists
      mapsUrl += `?key=${apiKey}`;
    } else if (this.config.config.production) {
      // Return error state if production build and no api key found
      this.isMapLoaded$.next(MapState.failure);
      console.error("Failed to load google maps api key from config");
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = mapsUrl;
    script.defer = true; // Run after page load
    script.async = true; // Run script async with rest of page

    script.addEventListener("error", () =>
      this.isMapLoaded$.next(MapState.failure)
    );
    script.addEventListener("load", () =>
      this.isMapLoaded$.next(MapState.success)
    );
    this.insertMapIntoDocument(script);
  }

  /**
   * Insert script to load google maps bundle into website document.
   * This is a separate function to make it easier for unit tests.
   */
  private insertMapIntoDocument(script: HTMLScriptElement) {
    document.head.appendChild(script);
  }
}

export type MapMarkerOption = google.maps.ReadonlyMarkerOptions;
