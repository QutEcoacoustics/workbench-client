import { GoogleMapsModule } from "@angular/google-maps";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { MapComponent } from "./map.component";

describe("MapComponent new", () => {
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
    spectator.setInput("sites", []);
    spectator.component.ngOnChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display placeholder", () => {
    spectator.setInput("sites", []);
    spectator.component.ngOnChanges();
    const label = spectator
      .query<HTMLDivElement>("div.map-placeholder")
      .innerText.trim();
    expect(label).toBe("No locations specified");
  });

  it("should display map", () => {
    spectator.setInput("sites", [new Site(generateSite())]);
    spectator.component.ngOnChanges();

    expect(getMap()).toBeTruthy();
  });

  it("should have info window", () => {
    spectator.setInput("sites", [new Site(generateSite())]);
    spectator.component.ngOnChanges();

    expect(getMap()).toBeTruthy();
  });

  it("should display single site", () => {
    spectator.setInput("sites", [new Site(generateSite())]);
    spectator.component.ngOnChanges();

    expect(getInfoWindow()).toBeTruthy();
  });

  it("should display multiple sites", () => {
    const sites = [1, 2, 3].map(() => new Site(generateSite()));
    spectator.setInput("sites", sites);
    spectator.component.ngOnChanges();

    expect(getMarker().length).toBe(3);
  });
});
