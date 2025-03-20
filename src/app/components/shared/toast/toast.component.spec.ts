import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ToastComponent } from "./toast.component";

describe("ToastComponent", () => {
  let spec: Spectator<ToastComponent>;

  const createComponent = createComponentFactory({
    component: ToastComponent,
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ToastComponent);
  });
});
