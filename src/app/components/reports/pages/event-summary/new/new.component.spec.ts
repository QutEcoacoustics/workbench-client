import { SpectatorRouting, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AudioRecordingsFilterComponent } from "@shared/date-time-filter/audio-recordings-filter.component";
import { TimeComponent } from "@shared/input/time/time.component";
import { Router } from "@angular/router";
import { NewEventReportComponent } from "./new.component";

xdescribe("NewEventReportComponent", () => {
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

  const sitesInput = (): HTMLInputElement => spectator.query("input[name='sitesInput']");
  const pointsInput = (): HTMLInputElement => spectator.query("input[name='pointsInput']");
  const recognizersInput = (): HTMLInputElement => spectator.query("input[name='recognizersInput']");
  const recognizersCutOffInput = (): HTMLInputElement => spectator.query("input[name='recognizersCutOffInput']");
  const chartsInput = (): HTMLInputElement => spectator.query("input[name='chartsInput']");
  const eventsOfInterestInput = (): HTMLInputElement => spectator.query("input[name='eventsOfInterestInput']");
  const submitFormButton = (): HTMLButtonElement => spectator.query("#generateReportButton");

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
