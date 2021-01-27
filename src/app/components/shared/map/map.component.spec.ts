import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { MockMapService } from "@services/map/mapMock.service";
import { LoadingComponent } from "@shared/loading/loading.component";
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

  [
    {
      label: "no locations placeholder",
      getComponent: () => spec.query("#placeholder p"),
      assertComponent: (comp: Element) =>
        expect(comp).toHaveText("No locations specified"),
      invalidMarkers: true,
      mapLoading: false,
      mapSuccess: false,
      mapFailure: false,
    },
    {
      label: "loading maps spinner",
      getComponent: () => spec.query(LoadingComponent),
      assertComponent: (comp: LoadingComponent) =>
        expect(comp).toBeInstanceOf(LoadingComponent),
      invalidMarkers: false,
      mapLoading: true,
      mapSuccess: false,
      mapFailure: false,
    },
    {
      label: "map failure placeholder",
      getComponent: () => spec.query("#failure p"),
      assertComponent: (comp: Element) =>
        expect(comp).toHaveText("Failure to load map"),
      invalidMarkers: false,
      mapLoading: false,
      mapSuccess: false,
      mapFailure: true,
    },
    {
      label: "map",
      getComponent: () => getMap(),
      assertComponent: (comp: GoogleMap) =>
        expect(comp).toBeInstanceOf(GoogleMap),
      invalidMarkers: false,
      mapLoading: false,
      mapSuccess: true,
      mapFailure: false,
    },
  ].forEach((test) => {
    function should(shouldDisplay: boolean, label: string) {
      return (shouldDisplay ? "should" : "should not") + " display " + label;
    }

    function assertComponent(shouldExist: boolean) {
      if (shouldExist) {
        test.assertComponent(test.getComponent() as any);
      } else {
        expect(test.getComponent()).toBeFalsy();
      }
    }

    it(`${should(
      test.invalidMarkers,
      test.label
    )} if markers is undefined`, () => {
      spec.setHostInput("markers", undefined);
      spec.detectChanges();
      assertComponent(test.invalidMarkers);
    });

    it(`${should(
      test.invalidMarkers,
      test.label
    )} if empty list of markers`, () => {
      spec.setHostInput("markers", List([]));
      spec.detectChanges();
      assertComponent(test.invalidMarkers);
    });

    it(`${should(test.invalidMarkers, test.label)} if no valid markers`, () => {
      spec.setHostInput("markers", List(invalidMarkers));
      spec.detectChanges();
      assertComponent(test.invalidMarkers);
    });

    it(`${should(test.mapLoading, test.label)} if valid markers`, () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      assertComponent(test.mapLoading);
    });

    it(`${should(
      test.mapLoading,
      test.label
    )} if mix of valid markers and invalid markers`, () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      assertComponent(test.mapLoading);
    });

    it(`${should(test.mapFailure, test.label)} if map failed to load`, () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.failure);
      spec.detectChanges();
      assertComponent(test.mapFailure);
    });

    it(`${should(
      test.mapSuccess,
      test.label
    )} if map successfully loaded with valid markers`, () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      assertComponent(test.mapSuccess);
    });

    it(`${should(
      test.mapSuccess,
      test.label
    )} if map successfully loaded with mix of valid markers and invalid markers`, () => {
      spec.setHostInput("markers", List([...validMarkers, ...invalidMarkers]));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      assertComponent(test.mapSuccess);
    });
  });

  describe("map", () => {
    it("should have info window", () => {
      spec.setHostInput("markers", List(validMarkers));
      spec.detectChanges();
      spec.inject(MapService).isMapLoaded$.next(MapService.mapState.success);
      spec.detectChanges();
      expect(getInfoWindow()).toBeInstanceOf(MapInfoWindow);
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
