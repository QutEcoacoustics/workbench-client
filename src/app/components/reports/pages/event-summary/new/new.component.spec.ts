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
  const recognizersCutOffInput = (): HTMLInputElement => spectator.query("input[name='recognizersCutOffInput']") as HTMLInputElement;
  const submitFormButton = (): HTMLButtonElement => spectator.query("#generateReportButton") as HTMLInputElement;

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewEventReportComponent);
    spectator.detectChanges();
  });

  it("should navigate to the correct url when the form is submitted", () => {
    const expectedUrl = "/projects/1135/reports/event-summary";
    submitFormButton().click();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedUrl);
  });

  // testing other inputs is not needed as they are tested in their own components
  // the recogniser cutoff however, is only implemented in the new view, and therefore, needs to be tested here
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
});
