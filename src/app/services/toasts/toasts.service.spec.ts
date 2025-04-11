import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { ToastOptions, ToastService, ToastVariant } from "./toasts.service";

interface ToastVariantTest {
  method: keyof Omit<ToastService, "showToastInfo" | "remove" | "toasts">;
  expectedVariant: ToastVariant;
}

describe("ToastsService", () => {
  let spec: SpectatorService<ToastService>;

  const createService = createServiceFactory({
    service: ToastService,
  });

  beforeEach(() => {
    spec = createService();
  });

  function generateToastInfo() {
    return {
      title: modelData.lorem.sentence(),
      message: modelData.lorem.sentence(),
      variant: modelData.helpers.arrayElement<ToastVariant>(["default", "success", "info", "warning", "danger"]),
      options: generateToastOptions(),
    };
  }

  function generateToastOptions(): Required<ToastOptions> {
    return {
      delay: modelData.datatype.number(),
      autoHide: modelData.datatype.boolean(),
    };
  }

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(ToastService);
  });

  // most of the toast opening functionality is tested in the variant tests
  describe("opening toasts", () => {
    it("should be able to open a toast with just a message", () => {
      const toastInfo = generateToastInfo();

      spec.service.show(toastInfo.message);

      // in this test, we assert that the default title and options are used
      expect(spec.service.toasts()).toContain({
        ...toastInfo,
        title: "",
        variant: "default",
        options: {},
      });
    });
  });

  describe("removing toasts", () => {
    it("should remove a toast correctly", () => {
      const toastInfo = generateToastInfo();
      const toastOptions = generateToastOptions();

      spec.service.show(toastInfo.message, toastInfo.title, toastOptions);
      spec.service.remove(toastInfo);

      expect(spec.service.toasts()).not.toContain(toastInfo);
    });

    it("should have no effect if a toast doesn't exist", () => {
      // In this test, I create multiple toasts so that it is more likely that
      // this test will fail if the service removes the incorrect toast.
      for (let i = 0; i < 5; i++) {
        spec.service.show(`non-removable toast ${i}`);
      }

      const initialToasts = spec.service.toasts();

      spec.service.remove(generateToastInfo());

      expect(spec.service.toasts()).toEqual(initialToasts);
    });

    it("should have no effect if an already removed toast is removed again", () => {
      const toastInfo = generateToastInfo();
      const toastOptions = generateToastOptions();

      spec.service.show(toastInfo.message, toastInfo.title, toastOptions);
      spec.service.remove(toastInfo);
      spec.service.remove(toastInfo);

      expect(spec.service.toasts()).not.toContain(toastInfo);
    });
  });

  describe("toast variant", () => {
    const toastVariantTests: ToastVariantTest[] = [
      { method: "show", expectedVariant: "default" },
      { method: "success", expectedVariant: "success" },
      { method: "error", expectedVariant: "danger" },
      { method: "info", expectedVariant: "info" },
      { method: "warning", expectedVariant: "warning" },
    ];

    for (const testCase of toastVariantTests) {
      it(`should create the correct variant when ${testCase.method} is called`, () => {
        const toastInfo = generateToastInfo();
        const toastOptions = generateToastOptions();

        spec.service[testCase.method](toastInfo.message, toastInfo.title, toastOptions);

        expect(spec.service.toasts()).toEqual([
          {
            title: toastInfo.title,
            message: toastInfo.message,
            options: toastOptions,
            variant: testCase.expectedVariant,
          },
        ]);
      });
    }
  });
});
