import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from "@angular/google-maps";
import { Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { List } from "immutable";
import { destroyGoogleMaps } from "@test/helpers/googleMaps";
import { modelData } from "@test/helpers/faker";
import { LoadingComponent } from "@shared/loading/loading.component";
import { GoogleMapsState, MapMarkerOptions, MapsService } from "@services/maps/maps.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { MockModule } from "ng-mocks";
import { provideMockConfig } from "@services/config/provide-configMock";
import { MapComponent } from "./map.component";

// Disabled because google maps bundle interferes with other tests
describe("MapComponent", () => {
  let spectator: Spectator<MapComponent>;
  let mapsServiceSpy: SpyObject<MapsService>;

  const createComponent = createComponentFactory({
    component: MapComponent,
    imports: [MockModule(GoogleMapsModule)],
    providers: [provideMockConfig(), provideMockBawApi()],
  });

  function getMap() {
    return spectator.query(GoogleMap);
  }

  function getInfoWindow() {
    return spectator.query(MapInfoWindow);
  }

  function getMarkers() {
    return spectator.queryAll(MapAdvancedMarker);
  }

  function getLoadingComponent(): LoadingComponent {
    return spectator.query(LoadingComponent);
  }

  function placeholderElement() {
    return spectator.query<HTMLDivElement>("div.map-placeholder");
  }

  /** Causes all pending 'loadAsync' promises to resolve */
  function triggerLoadSuccess(): void {
    mapsServiceSpy.mapsState = GoogleMapsState.Loaded;
    spectator.component["mapsLoadState"].set(mapsServiceSpy.mapsState);
    spectator.detectChanges();

    const markers = getMarkers();
    for (const marker of markers) {
      marker.advancedMarker = new google.maps.marker.AdvancedMarkerElement();
      marker.markerInitialized.emit(marker.advancedMarker);
    }
  }

  /** Causes all pending 'loadAsync' promises to reject */
  function triggerLoadFailure(): void {
    mapsServiceSpy.mapsState = GoogleMapsState.Failed;
    spectator.component["mapsLoadState"].set(mapsServiceSpy.mapsState);
    spectator.detectChanges();
  }

  function setup(markers: MapMarkerOptions[] = []): void {
    spectator = createComponent({ detectChanges: false });
    mapsServiceSpy = spectator.inject(MapsService);

    // when ng-spectator's setInput is used it will call detectChanges, meaning
    // that this will be the first change detection cycle
    spectator.setInput("markers", List(markers));

    if (markers.length) {
      spectator.component.hasMarkers = true;
      spectator.detectChanges();
    }
  }

  afterEach(() => {
    destroyGoogleMaps();
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(MapComponent);
  });

  describe("loading/error messages", () => {
    it("should display a placeholder when loading the google maps bundle", () => {
      setup();
      expect(getLoadingComponent()).toExist();
    });

    it("should display placeholder when there are no markers", () => {
      const expectedText = "No locations specified";

      setup();
      triggerLoadSuccess();

      expect(placeholderElement()).toHaveExactTrimmedText(expectedText);
    });

    it("should display an error if the google maps bundle fails to load", () => {
      const expectedText =
        "Failure loading map Please ensure your ad-block is not blocking Google Maps";

      setup();
      triggerLoadFailure();

      expect(placeholderElement()).toHaveExactTrimmedText(expectedText);
    });
  });

  describe("markers", () => {
    it("should display map", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getMap()).toExist();
    });

    it("should display single site", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getMarkers().length).toBeTruthy();
    });

    it("should display multiple markers", () => {
      const markers = modelData.randomArray(3, 3, () =>
        new Site(generateSite()).getMapMarker()
      );

      setup(markers);
      triggerLoadSuccess();

      expect(getMarkers()).toHaveLength(3);
    });

    it("should use the custom markerTemplate if present", () => {});
  });

  describe("hover info window", () => {
    it("should have info window", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getInfoWindow()).toExist();
    });

    it("should have the correct info window option on hover", () => {
      const marker = new Site(generateSite()).getMapMarker();

      setup([marker]);
      triggerLoadSuccess();

      const mapMarker = getMarkers()[0];
      expect(mapMarker).toExist();

      mapMarker.advancedMarker.dispatchEvent(new Event("pointerover"));
      spectator.detectChanges();

      const infoWindow = getInfoWindow();
      expect(infoWindow).toExist();
      expect(infoWindow.options.headerContent).toBe(marker.title);
    });

    // We should see that the info window headerContent is set to an empty
    // string.
    // If the title is not empty, we are not correctly handling the "null" case
    // for a marker that does not have a title.
    it("should have the correct info window options if there is no title", () => {
      const marker = new Site(generateSite()).getMapMarker();
      marker.title = null;

      setup([marker]);
      triggerLoadSuccess();

      const mapMarker = spectator.query("map-advanced-marker");
      expect(mapMarker).toExist();

      spectator.dispatchMouseEvent(mapMarker, "pointerover");

      const infoWindow = getInfoWindow();
      expect(infoWindow).toExist();
      expect(infoWindow.options.headerContent).toBe("");
    });

    it("should use the custom markerHoverTemplate", () => {});
  });

  describe("grouping", () => {
    const defaultGroupColor = "hsl(0, 100%, 50%)"; // Red

    it("should have the same color for markers in the same group", () => {
      const markers = modelData.randomArray(3, 3, () => {
        const marker = new Site(generateSite()).getMapMarker()
        marker.groupId = "same-group";
        return marker;
      });

      setup(markers);
      triggerLoadSuccess();

      const realizedColors = spectator.component.validMarkersOptions.map((marker) => {
        return spectator.component["markerColor"](marker);
      });

      const firstColor = realizedColors[0];
      for (const color of realizedColors) {
        expect(color).toEqual(firstColor);
      }

      // As a sanity check, ensure that the color is not the default "red" color
      // and that we have actually created a distinct color for this group.
      expect(firstColor).not.toEqual(defaultGroupColor);

      // Also ensure that if we get the color of a marker without a groupId,
      // it will be the default "red" color.
      const noGroupColor = spectator.component["markerColor"](
        new Site(generateSite()).getMapMarker(),
      );
      expect(noGroupColor).toEqual(defaultGroupColor);
    });

    // Because I have not set any groups on these markers, they should all use
    // the default "red" color.
    it("should use red markers when there are no groups", () => {
      const markers = modelData.randomArray(3, 3, () =>
        new Site(generateSite()).getMapMarker()
      );

      setup(markers);
      triggerLoadSuccess();

      const realizedColors = spectator.component.validMarkersOptions.map((marker) => {
        return spectator.component["markerColor"](marker);
      });

      for (const color of realizedColors) {
        expect(color).toEqual(defaultGroupColor);
      }
    });
  });
});
