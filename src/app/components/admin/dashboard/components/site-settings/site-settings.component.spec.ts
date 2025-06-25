import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SITE_SETTINGS } from "@baw-api/ServiceTokens";
import { of, throwError } from "rxjs";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SiteSetting } from "@models/SiteSetting";
import { generateSiteSetting } from "@test/fakes/SiteSetting";
import { modelData } from "@test/helpers/faker";
import { fakeAsync, tick } from "@angular/core/testing";
import { RangeComponent } from "@shared/input/range/range.component";
import { defaultDebounceTime } from "src/app/app.helper";
import { SiteSettingsService } from "@baw-api/site-settings/site-settings.service";
import { ToastService } from "@services/toasts/toasts.service";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { SiteSettingsComponent } from "./site-settings.component";

describe("SiteSettingsComponent", () => {
  let spec: Spectator<SiteSettingsComponent>;

  let siteSettingsApi: SpyObject<SiteSettingsService>;
  let toastSpy: SpyObject<ToastService>;

  let mockEnqueueLimit: SiteSetting;

  const enqueueLimitInput = () => spec.query(RangeComponent);
  const enqueueLimitNumberInput = () =>
    spec.query<HTMLInputElement>("input[type='number']");

  const createComponent = createComponentFactory({
    component: SiteSettingsComponent,
    providers: [provideMockBawApi()],
  });

  function updateValue(value: string) {
    spec.typeInElement(value, enqueueLimitNumberInput());

    // Because the input element is debounced, we need to fakeAsync await for
    // the debounce time until the request is sent out.
    tick(defaultDebounceTime);
    spec.detectChanges();
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    mockEnqueueLimit = new SiteSetting(
      generateSiteSetting({
        name: "batch_analysis_remote_enqueue_limit",
        // I set the maximum initial value to 9,999 instead of the maximum
        // 10,000 so that in update tests, I can increment the value by one and
        // ensure that the updated value is different from the initial value and
        // in in the valid range.
        // If I picked another random number, there would be a small chance that
        // the values would be the same, making the test flaky.
        value: modelData.datatype.number({ min: 0, max: 9_999 }),
      }),
    );

    siteSettingsApi = spec.inject(SITE_SETTINGS.token);
    siteSettingsApi.list.and.callFake(() => of([mockEnqueueLimit]));
    siteSettingsApi.update.and.callFake(() => of(mockEnqueueLimit));

    toastSpy = spec.inject(ToastService);
    spyOn(toastSpy, "success");
    spyOn(toastSpy, "error");

    spec.detectChanges();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(SiteSettingsComponent);
  });

  describe("batch analysis remote enqueue limit", () => {
    // Note that we ware not using a fakeAsync block to wait for the debounced
    // input.
    // I purposely did this because the initial value should be shown
    // immediately and should not be debounced, meaning that this test will fail
    // if the inputs initial value is incorrectly being debounced.
    it("should show the initial enqueue limit", () => {
      expect(enqueueLimitInput().value()).toEqual(mockEnqueueLimit.value);
    });

    it("should make the correct api request when updating the enqueue limit", fakeAsync(() => {
      // By incrementing the enqueue limit's initial value for the updated value
      // we can ensure that the updated value is not the same as the initial
      // value.
      // If we instead picked a truly random value as the new "updated" value,
      // there would be a slim chance that the values would be the same, and no
      // update would be triggered.
      const testUpdatedValue = mockEnqueueLimit.value + 1;
      const expectedUpdatedModel = new SiteSetting({
        ...mockEnqueueLimit,
        value: testUpdatedValue,
      });

      updateValue(testUpdatedValue.toString());

      expect(siteSettingsApi.update).toHaveBeenCalledOnceWith(
        expectedUpdatedModel,
      );
    }));

    it("should show a success notification if the value was updated", fakeAsync(() => {
      const testUpdatedValue = mockEnqueueLimit.value + 1;
      updateValue(testUpdatedValue.toString());

      const expectedMessage = `Successfully updated batch_analysis_remote_enqueue_limit to ${testUpdatedValue}`;
      expect(toastSpy.success).toHaveBeenCalledOnceWith(expectedMessage);
    }));

    it("should show an error toast if the update fails", fakeAsync(() => {
      const error = generateBawApiError();
      siteSettingsApi.update.and.returnValue(throwError(() => error));

      const testUpdatedValue = mockEnqueueLimit.value + 1;
      updateValue(testUpdatedValue.toString());

      const expectedMessage =
        "Failed to update batch_analysis_remote_enqueue_limit";
      expect(toastSpy.error).toHaveBeenCalledOnceWith(expectedMessage);
    }));
  });
});
