import { RouterTestingModule } from "@angular/router/testing";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { modelData } from "@test/helpers/faker";
import { ItemComponent } from "./item.component";

describe("ItemComponent", () => {
  let spec: SpectatorRouting<ItemComponent>;
  const createComponent = createRoutingFactory({
    component: ItemComponent,
    imports: [RouterTestingModule, IconsModule, NgbTooltipModule],
  });

  function setup(
    icon: IconProp,
    name: string,
    value: string | number,
    tooltip?: () => string
  ) {
    spec = createComponent({
      detectChanges: false,
      props: { icon, name, value, tooltip },
    });
  }

  it("should create", () => {
    setup(["fas", "home"], "Test", 0);
    spec.detectChanges();
    expect(spec.component).toBeInstanceOf(ItemComponent);
  });

  it("should display icon", () => {
    setup(["fas", "user"], "Test", 0);
    spec.detectChanges();
    expect(spec.query(FaIconComponent).icon).toEqual(["fas", "user"]);
  });

  it("should display name", () => {
    const name = modelData.company.name();
    setup(["fas", "home"], name, 0);
    spec.detectChanges();
    expect(spec.query("#name")).toContainText(name);
  });

  it("should display number value", () => {
    const value = modelData.datatype.number();
    setup(["fas", "home"], "Test", value);
    spec.detectChanges();
    expect(spec.query("#value")).toContainText(value.toString());
  });

  it("should display string value", () => {
    const value = modelData.company.name();
    setup(["fas", "home"], "Test", value);
    spec.detectChanges();
    expect(spec.query("#value")).toContainText(value.toString());
  });

  it("should display tooltip if given", () => {
    const value = modelData.company.name();
    setup(["fas", "home"], "Test", value, () => "custom tooltip");
    spec.detectChanges();
    expect(spec.query("#icon")).toHaveTooltip("custom tooltip");
  });
});
