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
    spectator.detectChanges();

    return spectator;
  }

  beforeEach(() => setup());

  const getLatitudeInput = () => spectator.query<HTMLInputElement>("#latitude");
  const getLongitudeInput = () =>
    spectator.query<HTMLInputElement>("#longitude");
  const getErrorElements = () =>
    spectator.queryAll<HTMLDivElement>(".invalid-feedback");

  function updateMarkerThroughInput(
    longitude: number | string,
    latitude: number | string
  ) {
    // Using typeInElement dispatches the "input" event that Angular listens to
    // https://github.com/ngneat/spectator/blob/549c63c43e9/projects/spectator/src/lib/type-in-element.ts#L18
    spectator.typeInElement(longitude.toString(), getLongitudeInput());
    spectator.typeInElement(latitude.toString(), getLatitudeInput());
    spectator.detectChanges();
  }

  /**
   * Changes the markers position by directly editing the model.
   * This is used to initialize the marker to the correct position, when the input field might not work
   */
  function explicitlySetMarker(longitude: number, latitude: number) {
    spectator.component.updateModel(longitude, latitude);
    spectator.detectChanges();
  }

  function assertMapModelCoordinates(
    map: MapComponent,
    longitude: number,
    latitude: number
  ) {
    expect(map.markers().toArray()[0]["position"]["lng"]).toEqual(longitude);
    expect(map.markers().toArray()[0]["position"]["lat"]).toEqual(latitude);
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(LocationInputComponent);
  });

  it("should display the position of the marker in input boxes", fakeAsync(() => {
    const defaultLongitudeValue = modelData.longitude();
    const defaultLatitudeValue = modelData.latitude();

    explicitlySetMarker(defaultLongitudeValue, defaultLatitudeValue);

    tick();

    expect(getLongitudeInput().value).toEqual(defaultLongitudeValue.toString());
    expect(getLatitudeInput().value).toEqual(defaultLatitudeValue.toString());
  }));

  it("should update the marker model if the location is updated through the input field/form", () => {
    const map = spectator.query(MapComponent);
    const defaultLongitudeValue = modelData.longitude();
    const defaultLatitudeValue = modelData.latitude();

    // set the markers to a starting position
    explicitlySetMarker(defaultLongitudeValue, defaultLatitudeValue);

    // change the markers location through the input field
    const updatedLongitudeValue = modelData.longitude();
    const updatedLatitudeValue = modelData.latitude();

    updateMarkerThroughInput(updatedLongitudeValue, updatedLatitudeValue);

    // assert that the marker location has changed to the new location
    assertMapModelCoordinates(map, updatedLongitudeValue, updatedLatitudeValue);
  });

  it("should update the marker model if the marker is dragged", () => {
    const map = spectator.query(MapComponent);
    const defaultLongitudeValue = modelData.longitude();
    const defaultLatitudeValue = modelData.latitude();

    // spy on the updateModel method so that we can assert later that it was called
    // with the correct parameters
    explicitlySetMarker(defaultLongitudeValue, defaultLatitudeValue);
    spyOn<any>(spectator.component, "updateModel").and.callThrough();

    // simulate moving the marker to a new position
    const updatedLongitude = modelData.longitude();
    const updatedLatitude = modelData.latitude();
    // simulate dragging and dropping the marker by sending a drag event to the map
    const newPosition: google.maps.LatLng = {
      lng: () => updatedLongitude,
      lat: () => updatedLatitude,
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
      newPosition.lng(),
      newPosition.lat()
    );
    assertMapModelCoordinates(map, updatedLongitude, updatedLatitude);
  });

  it("should emit 'null' if both the input fields are empty", () => {
    const expectedValue = { longitude: null, latitude: null };
    updateMarkerThroughInput("", "");

    expect(spectator.component.formControl.value).toEqual(expectedValue);
  });

  it("should display an error if there is a longitude but no latitude", () => {
    const expectedError =
      "Both latitude and longitude must be set or left empty";
    const longitude = modelData.longitude();

    updateMarkerThroughInput(longitude, "");

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

    updateMarkerThroughInput("", latitude);

    expect(getErrorElements()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ innerText: expectedError }),
      ])
    );
  });
});
