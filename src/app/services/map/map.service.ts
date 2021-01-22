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
 * Maps Service for Google Maps Wrapper.
 * This prevents the google maps api bundle being inserted
 * into the application multiple times.
 */
@Injectable({ providedIn: "root" })
export class MapService extends withUnsubscribe() {
  public static mapState = MapState;
  private static mapUrl = "https://maps.googleapis.com/maps/api/js";
  public isMapLoaded$: BehaviorSubject<MapState>;

  public constructor(private http: HttpClient, private config: ConfigService) {
    super();
    this.loadMap();
  }

  public get isMapLoaded(): MapState {
    return this.isMapLoaded$.getValue();
  }

  public isMarkerValid(marker: MapMarkerOption): boolean {
    return (
      typeof marker?.position?.lat === "number" &&
      typeof marker.position.lng === "number"
    );
  }

  public sanitizeMarkers(markers: MapMarkerOption[]): List<MapMarkerOption> {
    return List((markers ?? []).filter((marker) => this.isMarkerValid(marker)));
  }

  private loadMap() {
    let mapsUrl = MapService.mapUrl;
    if (this.apiKey) {
      mapsUrl += "?key=" + this.apiKey;
    }

    this.isMapLoaded$ = new BehaviorSubject(MapState.loading);
    this.http
      .jsonp(mapsUrl, "callback")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => this.isMapLoaded$.next(MapState.success),
        () => this.isMapLoaded$.next(MapState.failure)
      );
  }

  private get apiKey(): Option<string> {
    return this.config.environment.keys.googleMaps;
  }
}

export type MapMarkerOption = google.maps.ReadonlyMarkerOptions;
