import {
  BootstrapColorTypes,
  BootstrapScreenSizes,
} from "@helpers/bootstrapTypes";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { LoadingComponent } from "./loading.component";

interface LoadingComponentProps {
  color: BootstrapColorTypes;
  size: BootstrapScreenSizes;
  type: "border" | "grower";
}

describe("LoadingComponent", () => {
  let spec: Spectator<LoadingComponent>;
  const createComponent = createComponentFactory({
    component: LoadingComponent,
    imports: [NgbModule],
  });

  function getSpinner(className: string) {
    return spec.query(`#spinner.${className}`);
  }

  function setup(props: Partial<LoadingComponentProps>) {
    spec = createComponent({
      detectChanges: false,
      props,
    });
  }

  describe("colors", () => {
    const colors: BootstrapColorTypes[] = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "light",
      "dark",
    ];

    colors.forEach((color) => {
      it(`should display spinner with ${color} color`, () => {
        setup({ color });
        spec.detectChanges();
        expect(getSpinner(`text-${color}`)).toBeTruthy();
      });
    });
  });

  describe("size", () => {
    const sizes: BootstrapScreenSizes[] = ["xs", "sm", "md", "lg", "xl"];

    sizes.forEach((size) => {
      it(`should display border spinner with ${size} size`, () => {
        setup({ type: "border", size });
        spec.detectChanges();
        expect(getSpinner(`spinner-border-${size}`)).toBeTruthy();
      });

      it(`should display grower spinner with ${size} size`, () => {
        setup({ type: "grower", size });
        spec.detectChanges();
        expect(getSpinner(`spinner-grower-${size}`)).toBeTruthy();
      });
    });
  });

  describe("type", () => {
    it("should display a border type spinner", () => {
      setup({ type: "border" });
      spec.detectChanges();
      expect(getSpinner("spinner-border")).toBeTruthy();
    });

    it("should display a grower type spinner", () => {
      setup({ type: "grower" });
      spec.detectChanges();
      expect(getSpinner("spinner-grower")).toBeTruthy();
    });
  });
});
