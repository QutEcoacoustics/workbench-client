import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { IndicatorComponent, Status } from "./indicator.component";

describe("IndicatorComponent", () => {
  let spectator: Spectator<IndicatorComponent>;

  const createComponent = createComponentFactory({
    component: IndicatorComponent,
    imports: [IconsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it("should create", () => {
    expect(spectator.element).toBeTruthy();
  });

  it("should display success", () => {
    spectator.setInput("status", Status.success);
    spectator.detectChanges();

    const icon = spectator.query("fa-icon");
    expect(icon).toHaveStyle({ color: "limegreen" });
  });

  it("should display warning", () => {
    spectator.setInput("status", Status.warning);
    spectator.detectChanges();

    const icon = spectator.query("fa-icon");
    expect(icon).toHaveStyle({ color: "orange" });
  });

  it("should display error", () => {
    spectator.setInput("status", Status.error);
    spectator.detectChanges();

    const icon = spectator.query("fa-icon");
    expect(icon).toHaveStyle({ color: "red" });
  });
});
