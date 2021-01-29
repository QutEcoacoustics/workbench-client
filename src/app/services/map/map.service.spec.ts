import { TestRequest } from "@angular/common/http/testing";
import { Option } from "@helpers/advancedTypes";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { List } from "immutable";
import { MapMarkerOption, MapService } from "./map.service";

describe("MapService", () => {
  let spec: SpectatorHttp<MapService>;

  function createServiceFactory(key?: Option<string>, production?: boolean) {
    return createHttpFactory({
      service: MapService,
      imports: [MockAppConfigModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            config: { production },
            environment: { keys: { googleMaps: key } },
          },
        },
      ],
    });
  }

  function interceptHttpRequest(
    url: string = MapService["mapUrl"] + "?callback=JSONP_CALLBACK"
  ): TestRequest {
    return spec.expectOne(url, HttpMethod.JSONP);
  }

  describe("loadMap", () => {
    describe("without api key in development mode", () => {
      const createService = createServiceFactory(undefined, false);
      it("should make jsonp request", () => {
        spec = createService();
        const req = interceptHttpRequest();
        expect(req).toBeTruthy();
      });
    });

    describe("without api key in production mode", () => {
      const createService = createServiceFactory(undefined, true);
      it("should not make jsonp request", () => {
        spec = createService();
        spec.controller.verify();
      });
    });

    describe("with api key", () => () => {
      const createService = createServiceFactory("abcdefghi");
      it("should make jsonp request", () => {
        spec = createService();
        const req = interceptHttpRequest(
          MapService["mapUrl"] + "?key=abcdefghi&callback=JSONP_CALLBACK"
        );
        expect(req).toBeTruthy();
      });
    });
  });

  describe("isMapLoaded$", () => {
    describe("development mode", () => {
      const createService = createServiceFactory();
      beforeEach(() => (spec = createService()));

      it("should initially return loading", (done) => {
        interceptHttpRequest();
        spec.service.isMapLoaded$.subscribe((state) => {
          expect(state).toBe(MapService.mapState.loading);
          done();
        });
      });

      it("should return success on map load", (done) => {
        let count = 0;
        const req = interceptHttpRequest();
        spec.service.isMapLoaded$.subscribe((state) => {
          if (count === 0) {
            expect(state).toBe(MapService.mapState.loading);
            count++;
          } else {
            expect(state).toBe(MapService.mapState.success);
            done();
          }
        });

        req.flush(true);
      });

      it("should return failure on map error", (done) => {
        let count = 0;
        const req = interceptHttpRequest();
        spec.service.isMapLoaded$.subscribe((state) => {
          if (count === 0) {
            expect(state).toBe(MapService.mapState.loading);
            count++;
          } else {
            expect(state).toBe(MapService.mapState.failure);
            done();
          }
        });

        req.flush(false, { status: 500, statusText: "Unknown Error" });
      });

      it("isMapLoaded should return current value of isMapLoaded$", () => {
        interceptHttpRequest();
        spyOn(spec.service.isMapLoaded$, "getValue").and.callThrough();
        expect(spec.service.isMapLoaded).toBe(MapService.mapState.loading);
        expect(spec.service.isMapLoaded$.getValue).toHaveBeenCalledTimes(1);
      });
    });

    describe("production mode without api key", () => {
      const createService = createServiceFactory(undefined, true);
      beforeEach(() => (spec = createService()));

      it("should return failure", (done) => {
        spec.service.isMapLoaded$.subscribe((state) => {
          expect(state).toBe(MapService.mapState.failure);
          done();
        });
      });
    });
  });

  describe("isMarkerValid", () => {
    const createService = createServiceFactory();
    beforeEach(() => {
      spec = createService();
      interceptHttpRequest();
    });

    function isMarkerValid(marker: MapMarkerOption): boolean {
      return spec.service.isMarkerValid(marker);
    }

    it("should return false if marker is undefined", () => {
      expect(isMarkerValid(undefined)).toBeFalse();
    });

    it("should return false if marker position is undefined", () => {
      expect(isMarkerValid({ position: undefined })).toBeFalse();
    });

    it("should return false if latitude is undefined", () => {
      const marker = { position: { lng: 5, lat: undefined } };
      expect(isMarkerValid(marker)).toBeFalse();
    });

    it("should return false if longitude is undefined", () => {
      const marker = { position: { lat: 5, lng: undefined } };
      expect(isMarkerValid(marker)).toBeFalse();
    });

    it("should return true if marker is valid", () => {
      expect(isMarkerValid({ position: { lat: 5, lng: 10 } })).toBeTrue();
    });

    it("should return true if latitude and longitude are 0", () => {
      expect(isMarkerValid({ position: { lat: 0, lng: 0 } })).toBeTrue();
    });

    it("should call isLatitudeValid", () => {
      spyOn(spec.service, "isLatitudeValid").and.callThrough();
      isMarkerValid({ position: { lat: 0, lng: 0 } });
      expect(spec.service.isLatitudeValid).toHaveBeenCalledTimes(1);
    });

    it("should call isLongitudeValid", () => {
      spyOn(spec.service, "isLongitudeValid").and.callThrough();
      isMarkerValid({ position: { lat: 0, lng: 0 } });
      expect(spec.service.isLongitudeValid).toHaveBeenCalledTimes(1);
    });
  });

  describe("isLatitudeValid", () => {
    const createService = createServiceFactory();
    beforeEach(() => {
      spec = createService();
      interceptHttpRequest();
    });

    [
      { value: undefined, expected: false },
      { value: 0, expected: true },
      { value: 90, expected: true },
      { value: -90, expected: true },
      { value: 91, expected: false },
      { value: -91, expected: false },
    ].forEach(({ value, expected }) => {
      it(`should return ${expected} if ${value}`, () => {
        expect(spec.service.isLatitudeValid(value)).toBe(expected);
      });
    });
  });

  describe("isLongitudeValid", () => {
    const createService = createServiceFactory();
    beforeEach(() => {
      spec = createService();
      interceptHttpRequest();
    });

    [
      { value: undefined, expected: false },
      { value: 0, expected: true },
      { value: 180, expected: true },
      { value: -180, expected: true },
      { value: 181, expected: false },
      { value: -181, expected: false },
    ].forEach(({ value, expected }) => {
      it(`should return ${expected} if ${value}`, () => {
        expect(spec.service.isLongitudeValid(value)).toBe(expected);
      });
    });
  });

  describe("sanitizeMarkers", () => {
    let invalidMarkers: MapMarkerOption[];
    let validMarkers: MapMarkerOption[];
    const createService = createServiceFactory();
    beforeEach(() => {
      spec = createService();
      interceptHttpRequest();

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

    function sanitizeMapMarkers(
      markers: MapMarkerOption[]
    ): List<MapMarkerOption> {
      return spec.service.sanitizeMarkers(markers);
    }

    it("should return empty list if markers is undefined", () => {
      expect(sanitizeMapMarkers(undefined)).toEqual(List([]));
    });

    it("should return empty list if empty list of markers", () => {
      expect(sanitizeMapMarkers([])).toEqual(List([]));
    });

    it("should return empty list if all markers are invalid", () => {
      expect(sanitizeMapMarkers(invalidMarkers)).toEqual(List([]));
    });

    it("should return full list if all markers are valid", () => {
      expect(sanitizeMapMarkers(validMarkers)).toEqual(List(validMarkers));
    });

    it("should return partial list if some markers are valid", () => {
      expect(sanitizeMapMarkers([...invalidMarkers, ...validMarkers])).toEqual(
        List(validMarkers)
      );
    });
  });
});
