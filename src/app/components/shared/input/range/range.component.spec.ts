import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { RangeComponent } from "./range.component";

describe("RangeComponent", () => {
  let spec: Spectator<RangeComponent>;

  const sliderInput = () => spec.query<HTMLInputElement>(".slider-input");
  const numberInput = () => spec.query<HTMLInputElement>(".number-input");

  const createComponent = createComponentFactory({
    component: RangeComponent,
  });

  // You can pass an object into the setup function to initialize the component
  // with certain inputs/attributes set.
  function setup(inputs?: Record<string, unknown>): void {
    spec = createComponent({ detectChanges: false });

    if (inputs) {
      spec.setInput(inputs);
    }

    spec.detectChanges();
  }

  describe("without default attributes", () => {
    beforeEach(() => {
      setup();
    });

    it("should create", () => {
      expect(spec.component).toBeInstanceOf(RangeComponent);
    });

    it("should emit an 'input' event when the value changes", () => {
      // Because the input elements will initialize with a value of 0, we don't
      // want allow inputting a value of "0" in the test because that would
      // result in a leaky test that would periodically fail.
      const testedValue = modelData.datatype.number({ min: 1, max: 100 });

      spec.component.input.emit = jasmine.createSpy("input") as any;

      spec.typeInElement(testedValue.toString(), numberInput());
      expect(spec.component.input.emit).toHaveBeenCalledOnceWith(testedValue);
    });
  });

  describe("with attribute values", () => {
    it("should accept minimum, maximum, and step attributes", () => {
      const testMinimum = modelData.datatype.number();
      const testMaximum = modelData.datatype.number();
      const testStep = modelData.datatype.number();

      setup({
        min: testMinimum,
        max: testMaximum,
        step: testStep,
      });

      expect(sliderInput()).toHaveAttribute("min", testMinimum.toString());
      expect(sliderInput()).toHaveAttribute("max", testMaximum.toString());
      expect(sliderInput()).toHaveAttribute("step", testStep.toString());

      expect(numberInput()).toHaveAttribute("min", testMinimum.toString());
      expect(numberInput()).toHaveAttribute("max", testMaximum.toString());
      expect(numberInput()).toHaveAttribute("step", testStep.toString());
    });
  });
});
