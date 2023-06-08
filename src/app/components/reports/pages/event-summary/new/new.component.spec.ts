import { SpectatorRouting, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AudioRecordingsFilterComponent } from "@shared/audio-recordings-filter/audio-recordings-filter.component";
import { TimeComponent } from "@shared/input/time/time.component";
import { Router } from "@angular/router";
import { NewEventReportComponent } from "./new.component";

describe("NewEventReportComponent", () => {
  let spectator: SpectatorRouting<NewEventReportComponent>;
  let routerSpy: SpyObject<Router>;

  const createComponent = createRoutingFactory({
    declarations: [
      TimeComponent,
      AudioRecordingsFilterComponent
    ],
    imports: [
      SharedModule,
      MockBawApiModule,
      RouterTestingModule
    ],
    component: NewEventReportComponent,
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    routerSpy = spectator.inject(Router);
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  // we have to use "as HTMLInputElement" because `query` can return null if the element is not found
  // is a jasmine error is thrown "property x cannot be found on object null", the element names are not being found
  const sitesInput = (): HTMLInputElement => spectator.query("input[name='sitesInput']") as HTMLInputElement;
  const pointsInput = (): HTMLInputElement => spectator.query("input[name='pointsInput']") as HTMLInputElement;
  const recognizersInput = (): HTMLInputElement => spectator.query("input[name='recognizersInput']") as HTMLInputElement;
  const recognizersCutOffInput = (): HTMLInputElement => spectator.query("input[name='recognizersCutOffInput']") as HTMLInputElement;
  const chartsInput = (): HTMLInputElement => spectator.query("input[name='chartsInput']") as HTMLInputElement;
  const eventsOfInterestInput = (): HTMLInputElement => spectator.query("input[name='eventsOfInterestInput']") as HTMLInputElement;
  const submitFormButton = (): HTMLButtonElement => spectator.query("#generateReportButton") as HTMLInputElement;

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
    spectator.detectChanges();
  });

  it("should not make any api calls when the form is first loaded", () => {
  });

  it("should navigate to the correct url when the form is submitted", () => {
    const expectedUrl = "/projects/1135/reports/event-summary";
    submitFormButton().click();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedUrl);
  });

  describe("date time filters", () => {
    it("should not make any api calls when date time filters are empty", () => {
    });

    // since date time filters are used when generating the report and filtering for sites
    // there is no need to make any api calls when date time filters are valid
    it("should not make any api calls when date time filters are valid", () => {
    });
  });

  describe("recognizer cut off input", () => {
    it("should not be able to have an input above 1 (100%)", () => {
      const testValue = 1.01;
      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();
      expect(recognizersCutOffInput().value).toEqual("1");
    });

    it("should not be able to have an input below 0 (0%)", () => {
      const testValue = -0.01;
      spectator.typeInElement(testValue.toString(), recognizersCutOffInput());
      spectator.detectChanges();
      expect(recognizersCutOffInput().value).toEqual("0");
    });
  });

  describe("type ahead filters", () => {
    it("should not throw an error on input", () => {
      const typeAheadInputs: HTMLInputElement[] = [
        sitesInput(),
        pointsInput(),
        recognizersInput(),
        chartsInput(),
        eventsOfInterestInput()
      ];

      typeAheadInputs.forEach((element: HTMLInputElement): void => {
        expect(() => spectator.typeInElement("test", element)).not.toThrow();
        spectator.detectChanges();
      });
    });

    it("should send the correct api call when the sites input value changes", () => {
    });

    it("should send the correct api call when the points input value changes", () => {
    });

    it("should send the correct api call when the recognizers input value changes", () => {
    });

    it("should send the correct api call when the charts input value changes", () => {
    });

    it("should send the correct api call when the events of interest input value changes", () => {
    });
  });
});
