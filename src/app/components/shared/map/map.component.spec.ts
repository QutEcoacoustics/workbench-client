import { GoogleMapsModule } from "@angular/google-maps";
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
import { SharedModule } from "@shared/shared.module";
import { LoadingComponent } from "@shared/loading/loading.component";
import { MapsService } from "@services/maps/maps.service";
import { MapMarkerOptions, MapComponent } from "./map.component";

// Disabled because google maps bundle interferes with other tests
describe("MapComponent", () => {
  let spectator: Spectator<MapComponent>;
  let mapsServiceSpy: SpyObject<MapsService>;

  const createComponent = createComponentFactory({
    component: MapComponent,
    imports: [GoogleMapsModule, MockConfigModule, SharedModule],
  });

  function getMap() {
    return spectator.query<HTMLElement>("google-map");
  }

  function getInfoWindow() {
    return spectator.query<HTMLElement>("map-info-window");
  }

  function getMarker() {
    return spectator.queryAll<HTMLElement>("map-marker");
  }

  function getLoadingComponent(): LoadingComponent {
    return spectator.query(LoadingComponent);
  }

  function placeholderElement() {
    return spectator.query<HTMLDivElement>("div.map-placeholder");
  }

  /** Causes all pending 'loadAsync' promises to resolve */
  function triggerLoadSuccess(): void {
    mapsServiceSpy["handleGoogleMapsLoaded"]();
    spectator.detectChanges();
  }

  /** Causes all pending 'loadAsync' promises to reject */
  function triggerLoadFailure(): void {
    mapsServiceSpy["handleGoogleMapsFailed"]();
    spectator.detectChanges();
  }

  function setup(markers: MapMarkerOptions[] = []): void {
    mockGoogleNamespace();

    spectator = createComponent({ detectChanges: false });
    mapsServiceSpy = spectator.inject(MapsService);

    // when ng-spectator's setInput is used it will call detectChanges, meaning
    // that this will be the first change detection cycle
    spectator.setInput("markers", List(markers));
  }

  afterEach(() => {
    destroyGoogleMaps();
    MapsService["embeddedService"] = false;
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

  xdescribe("markers", () => {
    it("should display map", () => {
      const markers = [new Site(generateSite()).getMapMarker()];

      setup(markers);
      triggerLoadSuccess();

      expect(getMap()).toBeTruthy();
    });

    it("should have info window", () => {
      const markers = [new Site(generateSite()).getMapMarker()];
      setup(markers);

      expect(getMap()).toBeTruthy();
    });

    it("should display single site", () => {
      const markers = [new Site(generateSite()).getMapMarker()];
      setup(markers);

      expect(getInfoWindow()).toBeTruthy();
    });

    it("should display multiple markers", () => {
      const markers = modelData.randomArray(3, 3, () =>
        new Site(generateSite()).getMapMarker()
      );
      setup(markers);

      expect(getMarker().length).toBe(3);
    });
  });
});
