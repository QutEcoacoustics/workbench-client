import { DebugElement } from "@angular/core";
import { ComponentFixture, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

export function getText(target: DebugElement, selector: string) {
  return target
    .queryAll(By.css(selector))
    .map(x => x.nativeElement.textContent.trim());
}

export function getInputs(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelectorAll("formly-field");
}

export function inputValue(wrapper: any, selector: string, value: string) {
  const input = wrapper.querySelector(selector);
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

export function submitForm(fixture: ComponentFixture<any>) {
  const button = fixture.nativeElement.querySelector("button[type='submit']");
  button.click();

  tick();
  fixture.detectChanges();
}

export function assertValidationMessage(wrapper: any, message: string) {
  const error = wrapper.querySelector("formly-validation-message");
  expect(error).toBeTruthy();
  expect(error.innerText.trim()).toBe(message);
}

/**
 * Test a formly field
 * @param field Input to test
 * @param key Input ID/Key
 * @param htmlType Input type (input, textarea, select)
 * @param required Input required
 * @param label Input label
 * @param type Input type (text, number, password)
 * @param description Input description
 */
export function testFormlyField(
  testGroup: string,
  setup: () => void = () => {},
  field: any,
  key: string,
  htmlType: string,
  required: boolean,
  label?: string,
  type?: string,
  description?: string
) {
  describe(testGroup, () => {
    beforeEach(() => {
      setup();
    });

    it("should contain input", () => {
      expect(field).toBeTruthy();
    });

    it(`should be ${htmlType} input`, () => {
      expect(field.type).toBe(htmlType);
    });

    it(`should contain have "${key}" key`, () => {
      expect(field.key).toBe(key);
    });

    it(`should ${required ? "not " : ""}be required`, () => {
      expect(field.templateOptions.required).toBe(required);
    });

    if (label) {
      it("should have label", () => {
        expect(field.templateOptions.label).toBe(label);
      });
    }

    if (type) {
      it(`should be of type "${type}"`, () => {
        expect(field.templateOptions.type).toBe(type);
      });
    }

    if (description) {
      it("should contain description", () => {
        expect(field.templateOptions.description).toBe(description);
      });
    }
  });
}
