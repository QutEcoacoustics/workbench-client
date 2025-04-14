import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { List } from "immutable";
import {
  destroyGoogleMaps,
  mockGoogleNamespace,
} from "@test/helpers/googleMaps";
import { modelData } from "@test/helpers/faker";
import { MockConfigModule } from "@services/config/configMock.module";
import { LoadingComponent } from "@shared/loading/loading.component";
import { GoogleMapsState, MapMarkerOptions, MapsService } from "@services/maps/maps.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockModule } from "ng-mocks";
import { MapComponent } from "./map.component";

// Disabled because google maps bundle interferes with other tests
describe("MapComponent", () => {
  let spectator: Spectator<MapComponent>;
  let mapsServiceSpy: SpyObject<MapsService>;

  const createComponent = createComponentFactory({
    component: MapComponent,
    imports: [
      MockBawApiModule,
      MockConfigModule,
      MockModule(GoogleMapsModule),
    ],
  });

  function getMap() {
    return spectator.query(GoogleMap);
  }

  function getInfoWindow() {
    return spectator.query(MapInfoWindow);
  }

  function getMarkers() {
    return spectator.queryAll(MapMarker);
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
    spectator.component["googleMapsLoaded"] = true;
    spectator.detectChanges();
  }

  /** Causes all pending 'loadAsync' promises to reject */
  function triggerLoadFailure(): void {
    mapsServiceSpy.mapsState = GoogleMapsState.Failed;
    spectator.component["googleMapsLoaded"] = false;
    spectator.detectChanges();
  }

  function setup(markers: MapMarkerOptions[] = []): void {
    mockGoogleNamespace();

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

    it("should have info window", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getInfoWindow()).toExist();
    });

    // These tests are currently disabled because we don't want to/ actually
    // load Google Maps in the tests, and mocking the Google Maps component is
    // a maintenance burden
    // TODO: we should find a way to mock these tests
    xit("should display single site", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getMarkers().length).toBeTruthy();
    });

    xit("should display multiple markers", () => {
      const markers = modelData.randomArray(3, 3, () =>
        new Site(generateSite()).getMapMarker()
      );

      setup(markers);
      triggerLoadSuccess();

      expect(getMarkers()).toHaveLength(3);
    });
  });
});
