import { DebugElement } from "@angular/core";
import { ComponentFixture, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

/**
 * Assert icon
 * @param target Target element
 * @param prop Icon
 */
export function assertIcon(target: HTMLElement, prop: string) {
  const icon: HTMLElement = target.querySelector("fa-icon");
  expect(icon).toBeTruthy("No icon detected");
  expect(icon.attributes.getNamedItem("ng-reflect-icon")).toBeTruthy();
  expect(icon.attributes.getNamedItem("ng-reflect-icon").value.trim()).toBe(
    prop
  );
}

/**
 * Assert html element tooltip
 * @param target Target element
 * @param tooltip Tooltip text
 */
export function assertTooltip(target: HTMLElement, tooltip: string) {
  expect(target).toBeTruthy("No tooltip detected");

  let attr = target.attributes.getNamedItem("ng-reflect-ngb-tooltip");

  if (!attr) {
    attr = target.attributes.getNamedItem("ng-reflect-tooltip");
  }

  expect(attr).toBeTruthy();
  expect(attr.value.trim()).toBe(tooltip);

  // TODO Add accessability expectations
}

/**
 * Assert router link
 * @param target Target element
 * @param route Route text
 */
export function assertRoute(target: HTMLElement, route: string) {
  expect(target).toBeTruthy("No route detected");
  expect(target.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
  expect(
    target.attributes.getNamedItem("ng-reflect-router-link").value.trim()
  ).toBe(route);
}

/**
 * Get trimmed text content from an element
 * @param target Target element
 * @param selector HTML selector
 */
export function getText(target: DebugElement, selector: string) {
  return target
    .queryAll(By.css(selector))
    .map((x) => x.nativeElement.textContent.trim());
}

/**
 * Get formly field inputs from the component
 * @param fixture Component Fixture
 */
export function getInputs(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelectorAll("formly-field");
}

/**
 * Insert value into input element
 * @param wrapper Wrapper element
 * @param selector HTML selector
 * @param value Value to insert
 */
export function inputValue(wrapper: any, selector: string, value: string) {
  const input = wrapper.querySelector(selector);
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

/**
 * Click formly form submit button and update component.
 * Requires `fakeAsync` to use.
 * @param fixture Component fixture
 */
export function submitForm(fixture: ComponentFixture<any>) {
  const button = fixture.nativeElement.querySelector("button[type='submit']");
  button.click();

  tick();
  fixture.detectChanges();
}

/**
 * Assert validation message for formly field
 * @param wrapper Wrapper element
 * @param message Validation message
 */
export function assertValidationMessage(wrapper: any, message: string) {
  const error = wrapper.querySelector("formly-validation-message");
  expect(error).toBeTruthy();
  expect(error.innerText.trim()).toBe(message);
}

/**
 * Assert form component handles pre-loading model failure
 * @param fixture Component fixture
 */
export function assertResolverErrorHandling(fixture: ComponentFixture<any>) {
  const body = fixture.nativeElement;
  expect(body.childElementCount).toBe(0);
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

export function testFormlyFields(
  formInputs: {
    testGroup: string;
    setup: () => void;
    field: any;
    key: string;
    htmlType: string;
    required: boolean;
    label?: string;
    type?: string;
    description?: string;
  }[]
) {
  formInputs.forEach(
    ({
      testGroup,
      setup,
      field,
      key,
      htmlType,
      required,
      label,
      type,
      description,
    }) => {
      testFormlyField(
        testGroup,
        setup,
        field,
        key,
        htmlType,
        required,
        label,
        type,
        description
      );
    }
  );
}
