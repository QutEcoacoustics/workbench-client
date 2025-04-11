import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { ToastInfo, ToastOptions, ToastService } from "@services/toasts/toasts.service";
import { modelData } from "@test/helpers/faker";
import { ToastComponent } from "./toast.component";

describe("ToastComponent", () => {
  let spec: Spectator<ToastComponent>;
  let toastServiceSpy: SpyObject<ToastService>;

  let testedToast: Omit<ToastInfo, "message">;

  const createComponent = createComponentFactory({
    component: ToastComponent,
    mocks: [ToastService],
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });

    toastServiceSpy = spec.inject(ToastService);

    testedToast = {
      title: modelData.lorem.sentence(),
      variant: modelData.helpers.arrayElement(["default", "success", "info", "warning", "danger"]),
    };
    setToastProperties(testedToast);

    spec.detectChanges();
  }

  function openToast(): void {
    spec.component.open();
    spec.detectChanges();
  }

  function closeToast(): void {
    spec.component.close();
    spec.detectChanges();
  }

  function setToastProperties(toast: Omit<ToastInfo, "message">): void {
    const title = toast.title;
    const variant = toast.variant;
    const options = toast.options;

    // we have to use the @angular/testing setInput() instead of the
    // ngneat/spectator setInput() method because spectator's setInput method
    // doesn't support signals
    if (title) {
      spec.fixture.componentRef.setInput("title", title);
    }

    if (variant) {
      spec.fixture.componentRef.setInput("variant", variant);
    }

    if (options) {
      spec.fixture.componentRef.setInput("options", options);
    }
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ToastComponent);
  });

  it("should create a toast with no title or variant correctly", () => {
    spec.fixture.componentRef.setInput("title", undefined);
    spec.detectChanges();

    openToast();

    expect(toastServiceSpy.showToastInfo).toHaveBeenCalledOnceWith({
      title: undefined,
      variant: testedToast.variant,
      message: undefined,
      options: {},
    });
  });

  it("should open the toast with no options correctly", () => {
    openToast();

    expect(toastServiceSpy.showToastInfo).toHaveBeenCalledOnceWith({
      title: testedToast.title,
      variant: testedToast.variant,
      message: undefined,
      options: {},
    });
  });

  it("should open a toast with options correctly", () => {
    const testedOptions: ToastOptions = {
      autoHide: modelData.bool(),
      delay: modelData.datatype.number(),
    };

    spec.fixture.componentRef.setInput("options", testedOptions);
    spec.detectChanges();

    openToast();

    expect(toastServiceSpy.showToastInfo).toHaveBeenCalledWith(
      jasmine.objectContaining({
        options: testedOptions,
      }),
    );
  });

  it("should be able to open a toast multiple times", () => {
    openToast();
    openToast();
    expect(toastServiceSpy.showToastInfo).toHaveBeenCalledTimes(2);
  });

  it("should close the toast correctly", () => {
    openToast();
    closeToast();
    expect(toastServiceSpy.remove).toHaveBeenCalledTimes(1);
  });

  // the main purpose of this test is to test that no errors are thrown when
  // closing a toast that has not been opened
  it("should have no effect if a toast is closed without being opened", () => {
    closeToast();

    // we still expect that the remove method is called, but it should not a
    // have any effect
    expect(toastServiceSpy.remove).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.toasts).toHaveLength(0);
  });
});
