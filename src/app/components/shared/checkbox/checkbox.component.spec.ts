import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { CheckboxComponent } from "./checkbox.component";

describe("CheckboxComponent", () => {
  let spec: Spectator<CheckboxComponent>;

  const inputElement = () => spec.query<HTMLInputElement>("input");

  const createComponent = createComponentFactory({
    component: CheckboxComponent,
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(CheckboxComponent);
  });

  it("should be checked", () => {
    spec.setInput("checked", true);
    expect(inputElement()).toBeChecked();
  });

  it("should not be checked", () => {
    spec.setInput("checked", false);
    expect(inputElement()).not.toBeChecked();
  });

  it("should be disabled", () => {
    spec.setInput("disabled", true);
    expect(inputElement()).toBeDisabled();
  });

  it("should not be disabled", () => {
    spec.setInput("disabled", false);
    expect(inputElement()).not.toBeDisabled();
  });

  it("should allow being both checked and disabled", () => {
    spec.setInput("checked", true);
    spec.setInput("disabled", true);
    expect(inputElement()).toBeDisabled();
    expect(inputElement()).toBeChecked();
  });
});
