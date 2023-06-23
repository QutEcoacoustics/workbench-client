import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AudioRecordingsFilterComponent } from "@shared/audio-recordings-filter/audio-recordings-filter.component";
import { TimeComponent } from "@shared/input/time/time.component";
import { Router } from "@angular/router";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { Site } from "@models/Site";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { NewEventReportComponent } from "./new.component";

describe("NewEventReportComponent", () => {
  let spectator: SpectatorRouting<NewEventReportComponent>;
  let routerSpy: SpyObject<Router>;

  const createComponent = createRoutingFactory({
    declarations: [
      TimeComponent,
      AudioRecordingsFilterComponent,
      TypeaheadInputComponent,
    ],
    imports: [SharedModule, MockBawApiModule],
    component: NewEventReportComponent,
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    routerSpy = spectator.inject(Router);

    // ngOnInit
    spectator.detectChanges();

    // since resolver models are assigned during ngOnInit, we can replicate this functionality
    // by assigning them manually
    spectator.component.project = new Project(generateProject());
    spectator.component.region = new Region(generateRegion());
    spectator.component.site = new Site(generateSite());

    // afterViewInit
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  // we have to use "as HTMLInputElement" because `query` can return null if the element is not found
  // is a jasmine error is thrown "property x cannot be found on object null", the element names are not being found
  const regionsInput = () =>
    spectator.query("baw-typeahead-input[label='Site(s)']");
  const recognizersCutOffInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("input[name='provenancesCutOffInput']");
  const submitFormButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("#generateReportButton");
  const pageTitle = (): string =>
    spectator.query<HTMLHeadingElement>("h1.text-muted").innerText;
  const recognizerError = (): HTMLLabelElement | null =>
    spectator.query<HTMLLabelElement>(
      "label[for='provenancesCutOffInput'].form-error"
    );

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
  });

  it("should navigate to the correct url when the form is submitted with no user input/default values", () => {
    const expectedUrl = `/projects/${spectator.component.project.id}/regions/${
      spectator.component.region.id
    }/sites/${spectator.component.site.id}/reports/eventSummary?recognizersCutOff=${
      recognizersCutOffInput().value
    }&binSize=month`;

    submitFormButton().click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedUrl);
  });

  it("should navigate to the correct route when the form is submitted when all fields have a value", () => {
    const expectedRoute = `/projects/${spectator.component.project.id}/regions/`;

    submitFormButton().click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
  });

  it("should use the correct title", () => {
    const expectedTitle = `Site: ${spectator.component.site.name}`;
    expect(pageTitle()).toEqual(expectedTitle);
  });

  it("should hide the regions input if the report is being generated at the site or point level", () => {
    spectator.detectChanges();
    expect(regionsInput()).not.toExist();
  });

  it("should show the regions input if the report is being generated at the project level", () => {
    spectator.component.region = undefined;
    spectator.component.site = undefined;
    spectator.detectChanges();

    expect(regionsInput()).toExist();
  });

  // testing other inputs is not needed as they are tested in their own components
  // the recognizer cutoff however, is only implemented in the new view, and therefore, needs to be tested here
  describe("provenance cut off input", () => {
    it("should allow valid inputs without showing an error", () => {
      const testValue = 0.64313;
      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();
      expect(recognizersCutOffInput().value).toEqual(testValue.toString());
    });

    it("should not be able to have an input above 1 (100%)", () => {
      const testValue = 1.01;
      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement = recognizerError();
      expect(errorMessageElement).toExist();
    });

    it("should not be able to have an input below 0 (0%)", () => {
      const testValue = -0.01;
      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement = recognizerError();
      expect(errorMessageElement).toExist();
    });
  });
});
