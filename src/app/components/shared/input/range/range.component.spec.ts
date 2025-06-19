import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { RangeComponent } from "./range.component";

describe("RangeComponent", () => {
  let spec: Spectator<RangeComponent>;

  const createComponent = createComponentFactory({
    component: RangeComponent,
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(RangeComponent);
  });
});
