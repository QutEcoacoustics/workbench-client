import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { MockMapService } from "@services/map/mapMock.service";
import { LoadingModule } from "@shared/loading/loading.module";
import { List } from "immutable";
import { MockComponent, MockDirective } from "ng-mocks";
import { MapComponent } from "./map.component";

@Component({
  selector: "baw-test",
  template: "",
})
class TestComponent {
  @Input() public markers: List<MapMarkerOption>;
}

const mockMap = MockComponent(GoogleMap);
const mockMarker = MockDirective(MapMarker);
const mockInfoWindow = MockDirective(MapInfoWindow);

describe("MapComponent", () => {
  let invalidMarkers: MapMarkerOption[];
  let validMarkers: MapMarkerOption[];
  let spec: SpectatorHost<MapComponent, TestComponent>;
  const createComponent = createHostFactory<MapComponent, TestComponent>({
    component: MapComponent,
    imports: [HttpClientTestingModule, MockAppConfigModule, LoadingModule],
    declarations: [mockMap, mockMarker, mockInfoWindow],
    providers: [{ provide: MapService, useClass: MockMapService }],
  });

  function getMap() {
    return spec.query(mockMap);
  }

  function getInfoWindow() {
    return spec.query(mockInfoWindow);
  }

  function getMarkers() {
    return spec.queryAll(mockMarker);
  }

  beforeEach(() => {
    spec = createComponent('<baw-map [markers]="markers"></baw-map>', {
      hostProps: { markers: undefined },
    });

    validMarkers = [
      { position: { lat: 0, lng: 0 } },
      { position: { lat: 5, lng: 5 } },
      { position: { lat: 10, lng: 10 } },
    ];
    invalidMarkers = [
      undefined,
      { position: undefined },
      { position: { lng: 5, lat: undefined } },
      { position: { lat: 5, lng: undefined } },
    ];
  });

  it("should create", () => {
    spec.setHostInput("markers", List([]));
    spec.detectChanges();
    expect(spec.component).toBeInstanceOf(MapComponent);
  });

  describe("no locations placeholder", () => {
    function getPlaceholder() {
      return spec.query("#placeholder p");
    }

    function assertPlaceholder() {
      expect(getPlaceholder()).toHaveText("No locations specified");
    }

    it("should display placeholder if markers is undefined", () => {
      spec.setHostInput("markers", undefined);
      spec.detectChanges();
      assertPlaceholder();
    });

    it("should display placeholder if empty list of markers", () => {
      spec.setHostInput("markers", List([]));
      spec.detectChanges();
      assertPlaceholder();
    });

    it("should display placeholder if no valid markers", () => {
      spec.setHostInput("markers", List(invalidMarkers));
      spec.detectChanges();
      assertPlaceholder();
    });

    it("should clear placeholder if valid markers", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should clear placeholder if mix of valid and invalid markers", () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });
  });

  describe("loading maps placeholder", () => {
    function getSpinner() {
      return spec.query("#loading baw-loading");
    }

    it("should not display placeholder if markers is undefined", () => {
      spec.setHostInput("markers", undefined);
      spec.detectChanges();
      expect(getSpinner()).toBeFalsy();
    });

    it("should not display placeholder if empty list of markers", () => {
      spec.setHostInput("markers", List([]));
      spec.detectChanges();
      expect(getSpinner()).toBeFalsy();
    });

    it("should not display placeholder if no valid markers", () => {
      spec.setHostInput("markers", List(invalidMarkers));
      spec.detectChanges();
      expect(getSpinner()).toBeFalsy();
    });

    it("should display placeholder if valid markers", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      expect(getSpinner()).toBeTruthy();
    });

    it("should display placeholder if mix of valid and invalid markers", () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      expect(getSpinner()).toBeTruthy();
    });
  });

  describe("map failure placeholder", () => {
    function getPlaceholder() {
      return spec.query("#failure p");
    }

    function assertPlaceholder() {
      expect(getPlaceholder()).toHaveText("Failure to load map");
    }

    it("should not display placeholder if markers is undefined", () => {
      spec.setHostInput("markers", undefined);
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should not display placeholder if empty list of markers", () => {
      spec.setHostInput("markers", List([]));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should not display placeholder if no valid markers", () => {
      spec.setHostInput("markers", List(invalidMarkers));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should not display placeholder if valid markers and map loaded", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should not display placeholder if mix of valid and invalid markers and map loaded", () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should display placeholder if valid markers and map failed to load", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.failure);
      spec.detectChanges();
      assertPlaceholder();
    });
  });

  describe("map", () => {
    it("should display map", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      expect(getMap()).toBeTruthy();
    });

    it("should display map if mix of valid and invalid markers", () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      expect(getMap()).toBeTruthy();
    });

    it("should have info window", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      expect(getInfoWindow()).toBeTruthy();
    });

    it("should display single site", () => {
      spec.setHostInput("markers", List([validMarkers[0]]));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();

      const markers = getMarkers();
      expect(markers).toBeTruthy();
      expect(markers.length).toBe(1);
      expect(markers[0].position).toEqual(validMarkers[0].position);
    });

    it("should display multiple markers", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();

      const markers = getMarkers();
      expect(markers).toBeTruthy();
      expect(markers.length).toBe(validMarkers.length);

      validMarkers.forEach((marker, index) => {
        expect(markers[index].position).toEqual(marker.position);
      });
    });
  });
});
