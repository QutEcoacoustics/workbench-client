import { fakeAsync, tick } from "@angular/core/testing";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { MapComponent } from "@shared/map/map.component";
import { modelData } from "@test/helpers/faker";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { MapsService } from "@services/maps/maps.service";
import { formlyConfig } from "../custom-inputs.module";
import { LocationInputComponent } from "./location-input.component";

describe("FormlyLocationInput", () => {
  let model: any;
  let formGroup: FormGroup;
  let spectator: SpectatorHost<LocationInputComponent>;

  const createHost = createHostFactory({
    component: LocationInputComponent,
    providers: [provideMockBawApi()],
    imports: [
      GoogleMapsModule,
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
      MapComponent,
    ],
  });

  function setup(key: string = "input", options: FormlyFieldProps = {}) {
    formGroup = new FormGroup({ input: new FormControl("") });
    model = {};

    spectator = createHost(
      `
      <form [formGroup]="formGroup">
        <baw-location-input [field]="field"></baw-location-input>
      </form>
    `,
      {
        hostProps: {
          formGroup,
          field: {
            model,
            key,
            formControl: formGroup.get("input"),
            props: options,
          },
        },
      }
    );

    const mapsService = spectator.inject(MapsService);
    spyOn(mapsService, "loadAsync").and.returnValue(Promise.resolve());

    spectator.detectChanges();
  }

  beforeEach(fakeAsync(() => setup()));

  const getLatitudeInput = () => spectator.query<HTMLInputElement>("#latitude");
  const getLongitudeInput = () =>
    spectator.query<HTMLInputElement>("#longitude");
  const getErrorElements = () =>
    spectator.queryAll<HTMLDivElement>(".invalid-feedback");

  function updateMarkerThroughInput(
    latitude: number | string,
    longitude: number | string,
  ) {
    // Using typeInElement dispatches the "input" event that Angular listens to
    // https://github.com/ngneat/spectator/blob/549c63c43e9/projects/spectator/src/lib/type-in-element.ts#L18
    spectator.typeInElement(latitude.toString(), getLatitudeInput());
    spectator.typeInElement(longitude.toString(), getLongitudeInput());
    spectator.detectChanges();
  }

  /**
   * Changes the markers position by directly editing the model.
   * This is used to initialize the marker to the correct position, when the input field might not work
   */
  function explicitlySetMarker(latitude: number, longitude: number) {
    spectator.component.updateModel(latitude, longitude);
    spectator.detectChanges();
  }

  function assertMapModelCoordinates(
    map: MapComponent,
    latitude: number,
    longitude: number,
  ) {
    expect(map.markers().toArray()[0]["position"]["lat"]).toEqual(latitude);
    expect(map.markers().toArray()[0]["position"]["lng"]).toEqual(longitude);
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(LocationInputComponent);
  });

  it("should display the position of the marker in input boxes", fakeAsync(() => {
    const defaultLatitudeValue = modelData.latitude();
    const defaultLongitudeValue = modelData.longitude();

    explicitlySetMarker(defaultLatitudeValue, defaultLongitudeValue);

    tick();

    expect(getLatitudeInput().value).toEqual(defaultLatitudeValue.toString());
    expect(getLongitudeInput().value).toEqual(defaultLongitudeValue.toString());
  }));

  fit("should update the marker model if the location is updated through the input field/form", () => {
    const map = spectator.query(MapComponent);
    const defaultLatitudeValue = modelData.latitude();
    const defaultLongitudeValue = modelData.longitude();

    // set the markers to a starting position
    explicitlySetMarker(defaultLatitudeValue, defaultLongitudeValue);

    // change the markers location through the input field
    const updatedLatitudeValue = modelData.latitude();
    const updatedLongitudeValue = modelData.longitude();

    updateMarkerThroughInput(updatedLatitudeValue, updatedLongitudeValue);

    // assert that the marker location has changed to the new location
    assertMapModelCoordinates(map, updatedLatitudeValue, updatedLongitudeValue);
  });

  it("should update the marker model if the marker is dragged", () => {
    const map = spectator.query(MapComponent);
    const defaultLatitudeValue = modelData.latitude();
    const defaultLongitudeValue = modelData.longitude();

    // spy on the updateModel method so that we can assert later that it was called
    // with the correct parameters
    explicitlySetMarker(defaultLatitudeValue, defaultLongitudeValue);
    spyOn<any>(spectator.component, "updateModel").and.callThrough();

    // simulate moving the marker to a new position
    const updatedLatitude = modelData.latitude();
    const updatedLongitude = modelData.longitude();
    // simulate dragging and dropping the marker by sending a drag event to the map
    const newPosition: google.maps.LatLng = {
      lat: () => updatedLatitude,
      lng: () => updatedLongitude,
      equals: () => null,
      toJSON: () => null,
      toUrlValue: () => null,
    };

    map.newLocation.emit({
      domEvent: new Event("mapDragend"),
      latLng: newPosition,
      stop: () => {},
    });

    spectator.detectChanges();

    expect(spectator.component.updateModel).toHaveBeenCalledWith(
      newPosition.lat(),
      newPosition.lng(),
    );
    assertMapModelCoordinates(map, updatedLatitude, updatedLongitude);
  });

  it("should emit 'null' if both the input fields are empty", () => {
    const expectedValue = { latitude: null, longitude: null };
    updateMarkerThroughInput("", "");

    expect(spectator.component.formControl.value).toEqual(expectedValue);
  });

  it("should display an error if there is a longitude but no latitude", () => {
    const expectedError =
      "Both latitude and longitude must be set or left empty";
    const longitude = modelData.longitude();

    updateMarkerThroughInput("", longitude);

    expect(getErrorElements()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ innerText: expectedError }),
      ])
    );
  });

  it("should display an error if there is a latitude but no longitude", () => {
    const expectedError =
      "Both latitude and longitude must be set or left empty";
    const latitude = modelData.latitude();

    updateMarkerThroughInput(latitude, "");

    expect(getErrorElements()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ innerText: expectedError }),
      ])
    );
  });
});
