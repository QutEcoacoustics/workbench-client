import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PercentageInputComponent } from "./percentage-input.component";

describe("PercentageInputComponent", () => {
  let spec: Spectator<PercentageInputComponent>;

  const createComponent = createComponentFactory({
    component: PercentageInputComponent,
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(PercentageInputComponent);
  });
});
