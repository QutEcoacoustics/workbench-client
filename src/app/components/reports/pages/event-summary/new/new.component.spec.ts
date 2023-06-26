import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AudioRecordingsFilterComponent } from "@shared/audio-recordings-filter/audio-recordings-filter.component";
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
    declarations: [AudioRecordingsFilterComponent, TypeaheadInputComponent],
    imports: [SharedModule, MockBawApiModule],
    component: NewEventReportComponent,
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    routerSpy = spectator.inject(Router);

    spectator.detectChanges();

    // since resolver models are assigned during ngOnInit, we can replicate this functionality
    // by assigning them manually
    spectator.component.project = new Project(generateProject());
    spectator.component.region = new Region(generateRegion());
    spectator.component.site = new Site(generateSite());

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  // from audio-recording-filter.component.spec.ts
  const getDateToggleInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#date-filtering");
  const getDateStartedAfterInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#date-started-after");
  const getDateFinishedBeforeInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#date-finished-before");
  const getTimeOfDayToggleInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#time-filtering");
  const getIgnoreDaylightSavingsInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#ignore-daylight-savings");
  const getTimeOfDayStartedAfterInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#time-started-after input");
  const getTimeOfDayFinishedBeforeInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("#time-finished-before input");

  const regionsInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Site(s)']");
  const sitesInpt = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Point(s)']");
  const provenancesInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Recogniser(s)']");
  const recognizersCutOffInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("input[name='provenancesCutOffInput']");
  const binSizeInput = (): HTMLSelectElement =>
    spectator.query<HTMLSelectElement>("select[name='binSizeInput']");
  const chartsInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Chart(s)']");
  const tagsInput = (): HTMLElement =>
    spectator.query<HTMLElement>("baw-typeahead-input[label='Events of Interest']");

  const generateReportButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("#generateReportButton");
  const pageTitle = (): string =>
    spectator.query<HTMLHeadingElement>("h1.text-muted").innerText;

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === text
    ).nativeElement;
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
  });

  it("should navigate to the correct route when the form is submitted with no user input/default values", () => {
    // the default properties are hard coded into the tests and not fetched from DOM to ensure tests fail if default values are wrong
    // e.g. (undefined, null, "", etc..)
    // change these values if the default values change
    const defaultRecognizerCutOff = "0.8";
    const defaultBinSize = "month";
    const projectId = spectator.component.project.id;
    const regionId = spectator.component.region.id;
    const siteId = spectator.component.site.id;

    const expectedRoute = `/projects/${projectId}` +
      `/regions/${regionId}` +
      `/sites/${siteId}/reports/eventSummary` +
      `?recogniserCutOff=${defaultRecognizerCutOff}` +
      `&binSize=${defaultBinSize}`;

    generateReportButton().click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
  });

  it("should navigate to the correct route when the form is submitted when all fields have a value", () => {
    const projectId = spectator.component.project.id;
    const regionId = spectator.component.region.id;
    const siteId = spectator.component.site.id;

    const startDate = "2020-01-01";
    const endDate = "2020-02-01";
    const startTime = "00:00:00";
    const endTime = "23:59:59";
    const ignoreDaylightSavings = true;
    const regions = ["Brisbane", "Tasmania", "multiple words"];
    const sites = ["Cluster", "aaa", "foo", "bar", "hello world"];
    const provenances = ["BirdNet", "Lance's recognizer"];
    const recognizerCutOf = 0.5;
    const binSize = "Day";
    const charts = ["test chart 1"];
    const eventsOfInterest = ["kookaburra", "mallard", "black-headed gull"];

    const expectedRoute = `/projects/${projectId}` +
      `/regions/${regionId}` +
      `/sites/${siteId}/reports/eventSummary` +
      `?sites=${regions.join(",")}` +
      `&points=${sites.join(",")}` +
      `&recognizers=${provenances.join(",")}` +
      `&events=${eventsOfInterest.join(",")}` +
      `&recogniserCutOff=${recognizerCutOf}` +
      `&charts=${charts.join(",")}` +
      `&timeStartedAfter=${startTime}` +
      `&timeFinishedBefore=${endTime}` +
      `&dateStartedAfter=${startDate}` +
      `&dateFinishedBefore=${endDate}` +
      `&binSize=${binSize}` +
      `&ignoreDaylightSavings=${ignoreDaylightSavings}`;

    generateReportButton().click();

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
      const expectedError = "The recogniser cut-off are outside the permitted boundary. Ensure that the value is between 0 and 1.";

      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement =
        getElementByInnerText<HTMLLabelElement>(expectedError);
      expect(errorMessageElement).toExist();
      expect(errorMessageElement).toHaveClass("form-error");
    });

    it("should not be able to have an input below 0 (0%)", () => {
      const testValue = -0.01;
      const expectedError = "The recogniser cut-off are outside the permitted boundary. Ensure that the value is between 0 and 1.";

      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();

      const errorMessageElement: HTMLLabelElement =
        getElementByInnerText<HTMLLabelElement>(expectedError);
      expect(errorMessageElement).toExist();
      expect(errorMessageElement).toHaveClass("form-error");
    });
  });
});
