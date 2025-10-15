import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MapComponent } from "@shared/map/map.component";
import { MockModule } from "ng-mocks";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { GoogleMapsState, MapsService } from "@services/maps/maps.service";
import { generateAudioEventGroup } from "@test/fakes/AudioEventGroup";
import { provideRouter } from "@angular/router";
import { EventMapComponent } from "./event-map.component";

describe("EventMapComponent", () => {
  let spec: Spectator<EventMapComponent>;

  const createComponent = createComponentFactory({
    component: EventMapComponent,
    imports: [MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi(), provideRouter([])],
  });

  function setup(events: AudioEventGroup[] = []): void {
    spec = createComponent({
      props: { events },
    });

    const mapsServiceSpy = spec.inject(MapsService);

    // Because we don't actually load Google Maps in tests, we need to manually
    // trigger the "loaded" state so the map and markers render.
    mapsServiceSpy.mapsState = GoogleMapsState.Loaded;

    const mapComponent = spec.query(MapComponent);
    mapComponent["mapsLoadState"].set(mapsServiceSpy.mapsState);
    spec.detectChanges();

    const markers = mapMarkers();
    for (const marker of markers) {
      marker.advancedMarker = new google.maps.marker.AdvancedMarkerElement();
      marker.markerInitialized.emit(marker.advancedMarker);
    }
  }

  function mapMarkers() {
    return spec.queryAll(MapAdvancedMarker);
  }

  function clickMarker(index: number) {
    const mapMarker = mapMarkers()[index];
    expect(mapMarker).toExist();

    mapMarker.advancedMarker.dispatchEvent(new Event("click"));
    spec.detectChanges();
  }

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(EventMapComponent);
  });

  describe("markers", () => {
    it("should have the correct marker options", () => {
      const events = [
        new AudioEventGroup(generateAudioEventGroup()),
        new AudioEventGroup(generateAudioEventGroup()),
        new AudioEventGroup(generateAudioEventGroup()),
        new AudioEventGroup(generateAudioEventGroup()),
      ];

      setup(events);

      const markers = mapMarkers();

      expect(markers.length).toEqual(events.length);

      for (const i in markers) {
        const realized = markers[i];

        const targetEvent = events[i];
        const expected = {
          lat: targetEvent.latitude,
          lng: targetEvent.longitude,
        };

        expect(realized.position).toEqual(expected);
        expect(realized.title).toBe(`${targetEvent.eventCount} Events`);
      }
    });

    it("should have the correct marker template", () => {
      const event = new AudioEventGroup(generateAudioEventGroup());
      setup([event]);

      const markerTemplate = spec.query(".marker-template");
      expect(markerTemplate).toExist();

      const count = markerTemplate.querySelector(".marker-count");
      expect(count).toHaveExactTrimmedText(event.eventCount.toFixed());
    });
  });

  describe("events", () => {
    it("should emit 'site clicked' when a marker is clicked", () => {
      const event = new AudioEventGroup(generateAudioEventGroup());
      setup([event]);

      const siteClickedSpy = spyOn(spec.component.siteFocused, "emit");

      clickMarker(0);

      expect(siteClickedSpy).toHaveBeenCalledWith(event.siteId);
    });

    it("should not emit 'site clicked' when an already focused marker is clicked", () => {
      const event = new AudioEventGroup(generateAudioEventGroup());
      setup([event]);

      clickMarker(0);

      // Because we previously clicked the marker, the marker should now be
      // focused, meaning that any subsequent clicks should not emit the
      // siteFocused event.
      const siteClickedSpy = spyOn(spec.component.siteFocused, "emit");
      clickMarker(0);
      expect(siteClickedSpy).not.toHaveBeenCalled();
    });
  });
});
