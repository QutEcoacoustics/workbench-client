import { ComponentFixture, flush, tick } from "@angular/core/testing";
import { Spectator } from "@ngneat/spectator";
import { defaultDebounceTime } from "src/app/app.helper";

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
 * Selects an item from a typeahead component
 * This function must be used inside a fakeAsync block
 */
export function selectFromTypeahead<T>(
  spectator: Spectator<T>,
  target: HTMLElement,
  text: string
): void {
  const inputElement = target.querySelector("input");
  spectator.typeInElement(text, inputElement);

  // wait for the typeahead items to populate the dropdown with options
  spectator.detectChanges();
  tick(defaultDebounceTime);

  // click the first option in the dropdown
  const selectedTypeaheadOption = spectator.query<HTMLButtonElement>(
    "button.dropdown-item.active"
  );
  selectedTypeaheadOption.click();

  spectator.detectChanges();
  flush();
}

export function getElementByInnerText<T extends HTMLElement>(
  spectator: Spectator<unknown>,
  text: string
): T | null {
  return spectator.debugElement.query(
    (element) => element.nativeElement.innerText === text
  )?.nativeElement;
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

  // we do not use toExist() and toHaveExactText() here because they are ngNeat assertions and do not work when used
  // with Angular's TestBed
  expect(tooltipElement).toBeTruthy();
  expect(tooltipElement.textContent.trim()).toBe(content);

  element.dispatchEvent(new MouseEvent("mouseleave"));
}
