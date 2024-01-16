import { ComponentFixture } from "@angular/core/testing";

/**
 * TODO Replace with spectator method
 * Insert value into input element
 *
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
 * Assert form component handles pre-loading model failure
 * TODO Extract this to custom jasmine matcher
 *
 * @param fixture Component fixture
 * @param internal Is the baw-error-handler inside the component
 */
export function assertErrorHandler(
  fixture: ComponentFixture<any>,
  internal?: boolean
) {
  if (internal) {
    expect(
      fixture.nativeElement.querySelector("baw-error-handler h1")
    ).toBeTruthy();
  } else {
    expect(fixture.nativeElement.childElementCount).toBe(0);
  }
}

/**
 * Assert whether spinner is visible
 * TODO Extract this to custom jasmine matcher
 *
 * @param fixture Component fixture
 * @param visible Is spinner visible
 */
export function assertSpinner(
  fixture: ComponentFixture<any> | Element,
  visible: boolean
) {
  const spinner = (
    fixture instanceof ComponentFixture ? fixture.nativeElement : fixture
  ).querySelector("baw-loading");

  const expectation = expect(spinner);

  if (visible) {
    expectation.toBeTruthy("Expected Spinner to Exist");
  } else {
    expectation.toBeFalsy("Expected Spinner not to Exist");
  }
}

/**
 * Assert the bootstrap tooltip contents of an element
 *
 * @param element Element to check
 * @param content Expected tooltip content
 */
export function assertTooltip(element: HTMLElement, content: string) {
  element.dispatchEvent(new MouseEvent("mouseenter"));

  const tooltipElement = document.querySelector("ngb-tooltip-window");

  expect(tooltipElement).toExist();
  expect(tooltipElement).toHaveExactText(content);

  element.dispatchEvent(new MouseEvent("mouseleave"));
}
