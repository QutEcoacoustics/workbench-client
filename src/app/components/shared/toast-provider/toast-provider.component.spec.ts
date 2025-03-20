import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ToastProviderComponent } from "./toast-provider.component";

describe("ToastProviderComponent", () => {
  let spec: Spectator<ToastProviderComponent>;

  const createComponent = createComponentFactory({
    component: ToastProviderComponent,
  });

  function setup() {
    spec = createComponent({ detectChanges: false });
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ToastProviderComponent);
  });
});
