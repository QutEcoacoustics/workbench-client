import { ComponentFixture, flush, tick } from "@angular/core/testing";
import { Spectator, SpectatorHost } from "@ngneat/spectator";

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
  if (input.disabled) {
    fail("Input is disabled");
  }

  input.value = value;
  input.dispatchEvent(new Event("input"));
}

/**
 * A click button test helper that performs assertions that the element is a
 * button and is enabled.
 */
export function clickButton<T>(
  spectator: Spectator<T> | SpectatorHost<T>,
  selector: string | Element
): void {
  const element =
    typeof selector === "string" ? spectator.query(selector) : selector;

  // if we directly emitted a click event or used the click() method on a
  // disabled button, the button would still act as if it was clicked
  // this does not reflect the real world where the button would fail to click
  // if the user clicks on a disabled button
  if (!element) {
    fail("Could not perform click: Button not found");
  } else if (!(element instanceof HTMLButtonElement)) {
    fail("Could not perform click: Element is not a button element");
  } else if (element.disabled) {
    fail("Could not perform click: Button is disabled");
  }

  // using spectator.click() will cause a change detection cycle
  spectator.click(selector);
}

export function inputFile<T>(
  spectator: Spectator<T> | SpectatorHost<T>,
  selector: string | HTMLInputElement,
  files: File[]
): void {
  const element =
    typeof selector === "string"
      ? spectator.query<HTMLInputElement>(selector)
      : selector;

  if (!element) {
    fail("Could not perform file input: Input not found");
  } else if (!(element instanceof HTMLInputElement)) {
    fail("Could not perform file input: Element is not an input element");
  } else if (element.disabled) {
    fail("Could not perform file input: Input is disabled");
  }

  // Use the JS data transfer API to simulate a user
  // drag and dropping a file into the file image input.
  // this is done to add a mock file to the input field which we can
  // then test to see if it is removed with the getButton().click() method
  const dataTransfer = new DataTransfer();

  // Add the mock file to dataTransfer's DataTransferItemList object
  // DataTransferItemList is an object which stores a list of all DataTransfer
  // Objects
  for (const file of files) {
    dataTransfer.items.add(file);
  }

  // Set the Image Input file field to the DataTransferItemList Objects list of
  // items by value
  element.files = dataTransfer.files;

  element.dispatchEvent(new Event("change"));
  spectator.detectChanges();

  expect(element.value).toBeTruthy();
}

/**
 * Selects an item from a typeahead component
 * This function must be used inside a fakeAsync block
 */
export function selectFromTypeahead<T>(
  spectator: Spectator<T> | SpectatorHost<T>,
  target: Element | HTMLElement,
  text: string,
  detectChanges = true
): void {
  const inputElement = target.querySelector<HTMLInputElement>("input");
  spectator.typeInElement(text, inputElement);

  // wait for the typeahead items to populate the dropdown with options
  spectator.detectChanges();
  tick(1_000);

  // we do a document level querySelector so that if the dropdown is not in the
  // spectator hosts template, we can still select it
  const selectedTypeaheadOption = document.querySelector<HTMLButtonElement>(
    ".dropdown-item.active"
  );

  // We do not use the spectator.click() helper here because ng-neat spectator
  // will call detectChanges() after the click event.
  // Because we want to conditionally detect changes, we manually call click
  // and detect changes.
  selectedTypeaheadOption.click();

  if (detectChanges) {
    spectator.detectChanges();
  }

  flush();
}

/** Toggles a component decorated with ngb-dropdown and waits for it to open */
export function toggleDropdown<T>(
  spectator: Spectator<T>,
  target: Element | HTMLElement
): void {
  // bootstrap dropdowns take a full second to open
  spectator.click(target);
  waitForDropdown(spectator);
}

export function waitForDropdown<T>(spectator: Spectator<T>): void {
  spectator.tick(1_000);
}

export function getElementByInnerText<T extends HTMLElement>(
  spectator: Spectator<unknown> | SpectatorHost<unknown>,
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

export async function waitUntil(
  condition: () => boolean,
  timeout = 5_000,
  interval = 100
): Promise<void> {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    if (condition()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("Timeout exceeded while waiting for condition");
}
