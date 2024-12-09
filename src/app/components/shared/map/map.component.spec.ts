import { GoogleMapsModule } from "@angular/google-maps";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { List } from "immutable";
import { destroyGoogleMaps } from "@test/helpers/googleMaps";
import { modelData } from "@test/helpers/faker";
import { MapMarkerOptions, MapComponent } from "./map.component";

// Disabled because google maps bundle interferes with other tests
describe("MapComponent", () => {
  let spectator: Spectator<MapComponent>;

  const createComponent = createComponentFactory({
    component: MapComponent,
    imports: [GoogleMapsModule],
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

  function setup(markers: MapMarkerOptions[] = []): void {
    spectator = createComponent({ detectChanges: false });
    spectator.setInput("markers", List(markers));
  }

  afterEach(() => {
    destroyGoogleMaps();
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeTruthy();
  });

  it("should display a placeholder when loading the google maps bundle", () => {
    setup();
  });

  it("should display a placeholder when the markers are loading", () => {
    setup();
  });

  it("should display placeholder when there are no markers", () => {
    setup();

    const label = spectator
      .query<HTMLDivElement>("div.map-placeholder")
      .innerText.trim();

    expect(label).toBe("No locations specified");
  });

  it("should display an error if the google maps bundle fails to load", () => {});

  it("should display map", () => {
    const markers = [new Site(generateSite()).getMapMarker()];
    setup(markers);

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
