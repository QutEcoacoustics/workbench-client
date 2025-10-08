import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { FormControl, FormGroup } from "@angular/forms";
import { FormlyFieldProps } from "@ngx-formly/core";
import {
  clickButton,
  getElementByTextContent,
  selectFromTypeahead,
} from "@test/helpers/html";
import { modelData } from "@test/helpers/faker";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  LicensesService,
  SpdxLicense,
} from "@services/licenses/licenses.service";
import { fakeAsync, tick } from "@angular/core/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { LicenseInputComponent } from "./license-input.component";

describe("LicenseInputComponent", () => {
  let spec: SpectatorHost<LicenseInputComponent>;

  let model: string;
  let formGroup: FormGroup;
  let mockAvailableLicenses: Record<string, SpdxLicense>;

  let licenseService: SpyObject<LicensesService>;
  let modalsSpy: SpyObject<NgbModal>;

  const createHost = createHostFactory({
    component: LicenseInputComponent,
    imports: testFormImports,
    providers: [provideMockBawApi(), ...testFormProviders],
  });

  const licenseInput = () => spec.query("baw-typeahead-input");
  const removeButton = () =>
    getElementByTextContent<HTMLButtonElement>(spec, "Remove");
  const showButton = () =>
    getElementByTextContent<HTMLButtonElement>(spec, "Show");

  function setup(
    initialLicense?: string,
    options: FormlyFieldProps = {},
  ): void {
    const key = "license";

    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = "";

    const hostTemplate = `
      <form [formGroup]="formGroup">
        <baw-license-input [field]="field"></baw-license-input>
      </form>
    `;

    const formControl = formGroup.get("asFormControl");
    spec = createHost(hostTemplate, {
      detectChanges: false,
      hostProps: {
        formGroup,
        field: {
          props: options,
          formControl,
          model,
          key,
        },
      },
    });

    modalsSpy = spec.inject(NgbModal);
    const modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    spyOn(modalsSpy, "open").and.callThrough();

    mockAvailableLicenses = {
      [initialLicense ?? "mit-license"]: {
        name: initialLicense ?? "MIT License",
        url: modelData.internet.url(),
        osiApproved: modelData.datatype.boolean(),
        licenseText: modelData.lorem.paragraph(),
      },
      "mock-license": {
        name: "Mock License",
        url: modelData.internet.url(),
        osiApproved: modelData.datatype.boolean(),
        licenseText: modelData.lorem.paragraph(),
      },
      "CC-BY-4.0": modelData.license(),
      "CC-BY-NC-4.0": modelData.license(),
      "CC-BY-ND-4.0": modelData.license(),
      "CC-BY-NC-SA-4.0": modelData.license(),
      "CC-BY-NC-ND-4.0": modelData.license(),
    };

    licenseService = spec.inject(LicensesService);
    spyOn(licenseService, "availableLicenses").and.returnValue(
      mockAvailableLicenses,
    );

    if (initialLicense) {
      formControl.setValue(initialLicense);
    }

    spec.detectChanges();
    tick();
    spec.detectChanges();
  }

  afterEach(() => {
    modalsSpy?.dismissAll();
  });

  it("should create", fakeAsync(() => {
    setup();
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  }));

  describe("adding licenses", () => {
    it("should show the existing license value", fakeAsync(() => {
      const initialLicense = modelData.licenseName();
      setup(initialLicense);

      expect(spec.component.formControl.value).toEqual(initialLicense);
    }));

    it("should be able to add a new license", fakeAsync(() => {
      setup();
      expect(spec.component.formControl.value).toBeFalsy();

      selectFromTypeahead(spec, licenseInput(), "mit license");

      expect(spec.component.formControl.value).toEqual("mit-license");
    }));

    it("should be able to change an existing license", fakeAsync(() => {
      setup();
      const firstLicense = spec.component.formControl.value;

      selectFromTypeahead(spec, licenseInput(), "mock license");

      const finalLicense = spec.component.formControl.value;
      expect(firstLicense).not.toEqual(finalLicense);
      expect(finalLicense).toEqual("mock-license")
    }));

    // When the user clicks on the typeahead, it shows search results that
    // are not filtered by any search term. Because there is no search term, we
    // should see that the recommended CC licenses are at the top of the list.
    it("should show recommended licenses at the top of the typeahead", fakeAsync(() => {}));
  });

  describe("removing licenses", () => {
    it("should not show the remove button if there is no license selected", fakeAsync(() => {
      setup();
      expect(removeButton()).not.toExist();
    }));

    it("should be able to remove an existing license", fakeAsync(() => {
      setup(modelData.licenseName());
      clickButton(spec, removeButton());
      expect(spec.component.formControl.value).toBeNull();
    }));

    it("should be able to remove a license that was added after creation", fakeAsync(() => {
      setup();

      // add a license through the input after creation
      selectFromTypeahead(spec, licenseInput(), "mock license");

      // Assert that the license was successfully added so that this test
      // doesn't pass when it should have failed because the license was never
      // added.
      expect(spec.component.formControl.value).toEqual("mock-license");

      // once the remove button is clicked, the license should be removed and
      // we should not see the remove button anymore
      clickButton(spec, removeButton());
      expect(spec.component.formControl.value).toBeNull();
      expect(removeButton()).not.toExist();
    }));
  });

  describe("showing license information", () => {
    it("should not have a visible 'show' button if there is no selected license", fakeAsync(() => {
      setup();
      expect(showButton()).not.toExist();
    }));

    it("should show the current license information if the 'show' button is clicked", fakeAsync(() => {
      setup(modelData.licenseName());
      clickButton(spec, showButton());
      expect(modalsSpy.open).toHaveBeenCalledTimes(1);
    }));

    it("should add the 'show' button if a license is added after creation", fakeAsync(() => {
      setup();

      selectFromTypeahead(spec, licenseInput(), "mock license");

      clickButton(spec, showButton());
      expect(modalsSpy.open).toHaveBeenCalledTimes(1);
    }));
  });
});
