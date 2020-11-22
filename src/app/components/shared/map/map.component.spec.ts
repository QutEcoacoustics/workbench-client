import { GoogleMapsModule } from "@angular/google-maps";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { List } from "immutable";
import { MapComponent } from "./map.component";

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

  beforeAll(async () => await embedGoogleMaps());
  beforeEach(async () => (spectator = createComponent()));
  afterAll(() => destroyGoogleMaps());

  it("should create", () => {
    spectator.setInput("markers", List([]));
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display placeholder", () => {
    spectator.setInput("markers", List([]));
    spectator.detectChanges();
    const label = spectator
      .query<HTMLDivElement>("div.map-placeholder")
      .innerText.trim();
    expect(label).toBe("No locations specified");
  });

  it("should display map", () => {
    spectator.setInput(
      "markers",
      List([new Site(generateSite()).getMapMarker()])
    );
    spectator.detectChanges();

    expect(getMap()).toBeTruthy();
  });

  it("should have info window", () => {
    spectator.setInput(
      "markers",
      List([new Site(generateSite()).getMapMarker()])
    );
    spectator.detectChanges();

    expect(getMap()).toBeTruthy();
  });

  it("should display single site", () => {
    spectator.setInput(
      "markers",
      List([new Site(generateSite()).getMapMarker()])
    );
    spectator.detectChanges();

    expect(getInfoWindow()).toBeTruthy();
  });

  it("should display multiple markers", () => {
    const markers = List(
      [1, 2, 3].map(() => new Site(generateSite()).getMapMarker())
    );
    spectator.setInput("markers", markers);
    spectator.detectChanges();

    expect(getMarker().length).toBe(3);
  });
});
