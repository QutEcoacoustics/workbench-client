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
 * Assert image
 * @param target Target element
 * @param src Image src
 * @param alt Image alt
 */
export function assertImage(
  target: HTMLImageElement,
  src: string,
  alt: string,
  isUnauthenticated?: boolean
) {
  expect(target).toBeTruthy();
  expect(target.src).toBe(src);
  expect(target.alt).toBe(alt);

  if (isUnauthenticated) {
    expect(target.attributes.getNamedItem("ng-reflect-src")).toBeFalsy();
  } else {
    expect(target.attributes.getNamedItem("ng-reflect-src")).toBeTruthy();
  }
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

export function assertHref(target: HTMLAnchorElement, href: string) {
  expect(target).toBeTruthy();
  expect(target.href).toBe(href);
  expect(target.attributes.getNamedItem("ng-reflect-router-link")).toBeFalsy();
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
