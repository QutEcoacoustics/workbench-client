import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SITE_SETTINGS } from "@baw-api/ServiceTokens";
import { of } from "rxjs";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SiteSetting } from "@models/SiteSetting";
import { generateSiteSetting } from "@test/fakes/SiteSetting";
import { modelData } from "@test/helpers/faker";
import { fakeAsync, tick } from "@angular/core/testing";
import { RangeComponent } from "@shared/input/range/range.component";
import { defaultDebounceTime } from "src/app/app.helper";
import { SiteSettingsService } from "@baw-api/site-settings/site-settings.service";
import { InstanceSettingsComponent } from "./instance-settings.component";

describe("InstanceSettingsComponent", () => {
  let spec: Spectator<InstanceSettingsComponent>;
  let siteSettingsApi: SpyObject<SiteSettingsService>;
  let mockEnqueueLimit: SiteSetting;

  const enqueueLimitInput = () => spec.query(RangeComponent);
  const enqueueLimitNumberInput = () =>
    spec.query<HTMLInputElement>(".enqueue-limit-input input[type='number']");

  const createComponent = createComponentFactory({
    component: InstanceSettingsComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    mockEnqueueLimit = new SiteSetting(
      generateSiteSetting({
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
    siteSettingsApi.show.and.callFake(() => of(mockEnqueueLimit));
    siteSettingsApi.update.and.callFake(() => of(mockEnqueueLimit));

    spec.detectChanges();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(InstanceSettingsComponent);
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

      spec.typeInElement(
        testUpdatedValue.toString(),
        enqueueLimitNumberInput(),
      );

      // Because the input element is debounced, we need to fakeAsync await for
      // the debounce time until the request is sent out.
      tick(defaultDebounceTime);
      spec.detectChanges();

      expect(siteSettingsApi.update).toHaveBeenCalledOnceWith(
        expectedUpdatedModel,
      );
    }));
  });
});
