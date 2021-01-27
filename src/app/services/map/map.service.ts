import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Option } from "@helpers/advancedTypes";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

enum MapState {
  loading = 0,
  success = 1,
  failure = 2,
}

/**
 * Map Service for Google Maps Wrapper. This prevents the google maps
 * api bundle being inserted into the application multiple times.
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

  public constructor(private http: HttpClient, private config: ConfigService) {
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
   * Determine if a map marker is valid
   */
  public isMarkerValid(marker: MapMarkerOption): boolean {
    return (
      typeof marker?.position?.lat === "number" &&
      typeof marker.position.lng === "number"
    );
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
    // Only add api key if it exists
    let mapsUrl = MapService.mapUrl;
    if (this.apiKey) {
      mapsUrl += "?key=" + this.apiKey;
    }

    // Jsonp requests allow us to run the api bundle without
    // dealing with cors issues
    this.http
      .jsonp(mapsUrl, "callback")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => this.isMapLoaded$.next(MapState.success),
        () => this.isMapLoaded$.next(MapState.failure)
      );
  }

  /**
   * Retrieve google maps api key from config. Extracted to function
   * to make testing simpler
   */
  private get apiKey(): Option<string> {
    return this.config.environment.keys.googleMaps;
  }
}

export type MapMarkerOption = google.maps.ReadonlyMarkerOptions;
