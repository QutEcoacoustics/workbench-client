import { fakeAsync, flush } from "@angular/core/testing";
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
  let spec: SpectatorHost<LocationInputComponent>;

  const createHost = createHostFactory({
    component: LocationInputComponent,
    providers: [
      provideMockBawApi(),
    ],
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

    spec = createHost(
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

    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  const getLatitudeInput = () => spec.query<HTMLInputElement>("#latitude");
  const getLongitudeInput = () =>
    spec.query<HTMLInputElement>("#longitude");
  const getErrorElements = () =>
    spec.queryAll<HTMLDivElement>(".invalid-feedback");

  function updateMarkerThroughInput(
    latitude: number | string,
    longitude: number | string,
  ) {
    // Using typeInElement dispatches the "input" event that Angular listens to
    // https://github.com/ngneat/spectator/blob/549c63c43e9/projects/spectator/src/lib/type-in-element.ts#L18
    spec.typeInElement(latitude.toString(), getLatitudeInput());
    spec.typeInElement(longitude.toString(), getLongitudeInput());

    spec.detectChanges();
    flush();
    spec.detectChanges();
  }

  /**
   * Changes the markers position by directly editing the model.
   * This is used to initialize the marker to the correct position, when the input field might not work
   */
  function explicitlySetMarker(latitude: number, longitude: number) {
    spec.component.updateModel(latitude, longitude);

    spec.detectChanges();
    flush();
    spec.detectChanges();
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
    expect(spec.component).toBeInstanceOf(LocationInputComponent);
  });

  it("should display the position of the marker in input boxes", fakeAsync(() => {
    const defaultLatitudeValue = modelData.latitude();
    const defaultLongitudeValue = modelData.longitude();

    explicitlySetMarker(defaultLatitudeValue, defaultLongitudeValue);

    expect(getLatitudeInput().value).toEqual(defaultLatitudeValue.toString());
    expect(getLongitudeInput().value).toEqual(defaultLongitudeValue.toString());
  }));

  it("should update the marker model if the location is updated through the input field/form", fakeAsync(() => {
    const map = spec.query(MapComponent);
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
  }));

  it("should update the marker model if the marker is dragged", fakeAsync(() => {
    const map = spec.query(MapComponent);
    const defaultLatitudeValue = modelData.latitude();
    const defaultLongitudeValue = modelData.longitude();

    // spy on the updateModel method so that we can assert later that it was called
    // with the correct parameters
    explicitlySetMarker(defaultLatitudeValue, defaultLongitudeValue);
    spyOn<any>(spec.component, "updateModel").and.callThrough();

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

    spec.detectChanges();
    flush();
    spec.detectChanges();

    expect(spec.component.updateModel).toHaveBeenCalledWith(
      newPosition.lat(),
      newPosition.lng(),
    );
    assertMapModelCoordinates(map, updatedLatitude, updatedLongitude);
  }));

  it("should emit 'null' if both the input fields are empty", fakeAsync(() => {
    const expectedValue = { latitude: null, longitude: null };
    updateMarkerThroughInput("", "");

    expect(spec.component.formControl.value).toEqual(expectedValue);
  }));

  it("should display an error if there is a longitude but no latitude", fakeAsync(() => {
    const expectedError =
      "Both latitude and longitude must be set or left empty";
    const longitude = modelData.longitude();

    updateMarkerThroughInput("", longitude);

    expect(getErrorElements()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ innerText: expectedError }),
      ])
    );
  }));

  it("should display an error if there is a latitude but no longitude", fakeAsync(() => {
    const expectedError =
      "Both latitude and longitude must be set or left empty";
    const latitude = modelData.latitude();

    updateMarkerThroughInput(latitude, "");

    expect(getErrorElements()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ innerText: expectedError }),
      ])
    );
  }));
});
