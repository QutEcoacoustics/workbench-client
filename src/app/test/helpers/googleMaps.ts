/**
 * Remove the google maps script from the document. This should
 * only be accessed by unit tests.
 */
export function destroyGoogleMaps(): void {
  document.getElementById("google-maps")?.remove();
}

export function mockGoogleNamespace(): void {
  window.google = {
    maps: {
      LatLngBounds: MockLatLngBounds,
      marker: {
        PinElement: jasmine.createSpy("PinElement"),
        AdvancedMarkerElement: MockAdvancedMarkerElement,
      },
      Marker: jasmine.createSpy("Marker"),
      Map: jasmine.createSpy("Map"),
      InfoWindow: jasmine.createSpy("InfoWindow"),
      event: {
        addListener: jasmine.createSpy("addListener"),
      },
    },
  } as any;
}

class MockLatLngBounds {
  public extend = jasmine.createSpy("extend");
}

class MockAdvancedMarkerElement {
  public constructor(data: Record<PropertyKey, unknown>) {
    Object.assign(this, data);
  }
}
