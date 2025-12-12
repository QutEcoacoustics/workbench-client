import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import {
  ToastOptions,
  ToastService,
  ToastVariant,
} from "@services/toasts/toasts.service";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { modelData } from "@test/helpers/faker";
import { fakeAsync, tick } from "@angular/core/testing";
import { clickButton } from "@test/helpers/html";
import { IconsModule } from "@shared/icons/icons.module";
import { ToastProviderComponent } from "./toast-provider.component";

interface ToastVariantTest {
  method: keyof ToastService;
  expectedVariant: ToastVariant;
  expectedIcon: IconProp;
}

const defaultHideDelay = 5_000;

describe("ToastProviderComponent", () => {
  let spec: Spectator<ToastProviderComponent>;
  let toastServiceSpy: SpyObject<ToastService>;

  const createComponent = createComponentFactory({
    component: ToastProviderComponent,
    imports: [IconsModule],
  });

  function setup() {
    spec = createComponent({ detectChanges: false });

    toastServiceSpy = spec.inject(ToastService);
    spyOn(toastServiceSpy, "remove").and.callThrough();

    spec.detectChanges();
  }

  const toasts = () => spec.queryAll(".toast-item");

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ToastProviderComponent);
  });

  it("should create a toast with options correctly", () => {
    const testedOptions: ToastOptions = {
      autoHide: false,
      delay: modelData.datatype.number(),
    };

    toastServiceSpy.show(
      modelData.lorem.sentence(),
      modelData.lorem.sentence(),
      testedOptions
    );
    spec.detectChanges();

    const targetToast = spec.query(NgbToast);
    expect(targetToast.autohide).toEqual(testedOptions.autoHide);
    expect(targetToast.delay).toEqual(testedOptions.delay);
  });

  it("should use the correct default values if no options are provided", () => {
    const expectedDefaultOptions: ToastOptions = {
      autoHide: true,
      delay: defaultHideDelay,
    };

    toastServiceSpy.show(modelData.lorem.sentence());
    spec.detectChanges();

    const targetToast = spec.query(NgbToast);
    expect(targetToast.autohide).toEqual(expectedDefaultOptions.autoHide);
    expect(targetToast.delay).toEqual(expectedDefaultOptions.delay);
  });

  it("should remove a toast correctly after the auto hide triggers", fakeAsync(() => {
    toastServiceSpy.show(modelData.lorem.sentence());
    spec.detectChanges();

    tick(5_500);
    spec.detectChanges();

    expect(toastServiceSpy.remove).toHaveBeenCalledTimes(1);
    expect(toasts()).toHaveLength(0);
  }));

  it("should be able to dismiss a toast with the close button", () => {
    toastServiceSpy.show(modelData.lorem.sentence());
    spec.detectChanges();

    clickButton(spec, "[aria-label='Close']");

    expect(toastServiceSpy.remove).toHaveBeenCalledTimes(1);
    expect(toasts()).toHaveLength(0);
  });

  it("should display a toast with text content correctly", () => {
    const testedText = modelData.lorem.sentence();

    toastServiceSpy.show(testedText);
    spec.detectChanges();

    expect(toasts()[0]).toHaveExactTrimmedText(testedText);
  });

  it("should display a toast with a template correctly", () => {});

  it("should stack multiple toasts correctly", () => {
    // In this test, we purposely assert stacking two of the same type of
    // toasts, and one different type of toast.
    const firstToastText = modelData.lorem.paragraph();
    toastServiceSpy.success(firstToastText);
    spec.detectChanges();

    const secondToastText = modelData.lorem.paragraph();
    toastServiceSpy.success(secondToastText);
    spec.detectChanges();

    const thirdToastText = modelData.lorem.paragraph();
    toastServiceSpy.error(thirdToastText);
    spec.detectChanges();

    expect(toasts()).toHaveLength(3);

    expect(toasts()[0]).toHaveExactTrimmedText(firstToastText);
    expect(toasts()[1]).toHaveExactTrimmedText(secondToastText);
    expect(toasts()[2]).toHaveExactTrimmedText(thirdToastText);
  });

  it("should stack multiple toasts with fixed template and text content correctly", () => {});

  describe("toast variants", () => {
    const testCases = [
      { method: "success", expectedVariant: "success", expectedIcon: ["fas", "check"] },
      { method: "warning", expectedVariant: "warning", expectedIcon: ["fas", "exclamation-triangle"] },
      { method: "error", expectedVariant: "danger", expectedIcon: ["fas", "hand"] },
      { method: "info", expectedVariant: "info", expectedIcon: ["fas", "info-circle"] },
      { method: "show", expectedVariant: "default", expectedIcon: null },
    ] as const satisfies ToastVariantTest[];

    for (const test of testCases) {
      it(`should have the correct theming for a '${test.expectedVariant}' toast variant`, () => {
        const testMessage = modelData.lorem.sentence();

        toastServiceSpy[test.method](testMessage);
        spec.detectChanges();

        const targetToast = toasts()[0];
        expect(targetToast).toHaveClass(`bg-${test.expectedVariant}`);
        expect(targetToast).toHaveClass(`text-bg-${test.expectedVariant}`);
      });

      it(`should have the correct icon for a '${test.expectedVariant}' toast variant`, () => {
        const testMessage = modelData.lorem.sentence();

        toastServiceSpy[test.method](testMessage);
        spec.detectChanges();

        const toastIcon = spec.query(FaIconComponent);

        if (test.expectedIcon === null) {
          expect(toastIcon).toBeNull();
        } else {
          expect(toastIcon.icon()).toEqual(test.expectedIcon);
        }
      });
    }
  });
});
