import { DebugElement } from "@angular/core";
import { ComponentFixture, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

declare const ng: any;

/**
 * Assert icon
 *
 * @param target Target element
 * @param prop Icon
 */
export function assertIcon(target: HTMLElement, prop: string | IconProp) {
  if (prop instanceof Array) {
    prop = prop.join(",");
  }

  const icon: HTMLElement = target.querySelector("fa-icon");
  expect(icon).toBeTruthy("No icon detected");
  expect(icon.attributes.getNamedItem("ng-reflect-icon")).toBeTruthy();
  expect(icon.attributes.getNamedItem("ng-reflect-icon").value.trim()).toBe(
    prop as string
  );
}

/**
 * Assert image
 *
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
  expect(target).toBeTruthy("Image should exist");
  expect(target.src).toBe(src);
  expect(target.alt).toBe(alt);

  const imageDirective: AuthenticatedImageDirective = ng
    .getDirectives(target)
    .find((directive) => directive instanceof AuthenticatedImageDirective);

  if (isUnauthenticated) {
    if (imageDirective) {
      expect(imageDirective);
    } else {
      expect(imageDirective.disableAuth).toBeTrue();
    }
  } else {
    expect(imageDirective).toBeTruthy();
  }
}

/**
 * Assert html element tooltip
 *
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

  // TODO Add accessability expectations (id, visible on highlight, etc.)
}

export function assertHref(target: HTMLAnchorElement, href: string) {
  expect(target).toBeTruthy("No link detected");
  expect(target).toHaveAttribute("href", encodeURI(href));
}

/**
 * Assert router link
 *
 * @param target Target element
 * @param route Route text
 */
export function assertRoute(target: HTMLElement, route: string) {
  expect(target).toBeTruthy("No route detected");
  expect(target).toHaveAttribute("ng-reflect-router-link");
  expect(target).toHaveAttribute("href", encodeURI(route));
}

/**
 * Assert strong route link
 *
 * @param target Target element
 * @param route Route text
 */
export function assertStrongRouteLink(target: HTMLElement, route: string) {
  expect(target).toBeTruthy("No route detected");
  expect(target).toHaveAttribute("ng-reflect-strong-route");
  expect(target).toHaveAttribute("href", encodeURI(route));
}

/**
 * Assert strong route link active is set
 *
 * @param target Target element
 */
export function assertStrongRouteActive(target: HTMLElement) {
  assertAttribute(target, "strong-route-active", "active");
}

/**
 * Assert url link
 *
 * @param target Target element
 * @param route Route text
 */
export function assertUrl(target: HTMLElement, route: string) {
  expect(target).toBeTruthy("No route detected");
  expect(target).toHaveAttribute("ng-reflect-baw-url");
  expect(target).toHaveAttribute("href", encodeURI(route));
}

/**
 * Assert html angular attribute
 *
 * @param target Target element
 * @param key Attribute key (minus ng-reflect-)
 * @param value Expected value of attribute
 */
export function assertAttribute(target: HTMLElement, key: string, value: any) {
  const attribute = target.attributes.getNamedItem("ng-reflect-" + key);
  expect(attribute).toBeTruthy(`HTML element should have ${key} attribute`);
  expect(attribute.value.trim()).toBe(
    value,
    `HTML element ${key} attribute should be ${value}`
  );
}

/**
 * Get trimmed text content from an element
 *
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
 *
 * @param fixture Component Fixture
 */
export function getInputs(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelectorAll("formly-field");
}

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
 * Click formly form submit button and update component.
 * Requires `fakeAsync` to use.
 *
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
 *
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
 *
 * @param fixture Component fixture
 * @param visible Is spinner visible
 */
export function assertSpinner(
  fixture: ComponentFixture<any>,
  visible: boolean
) {
  const expectation = expect(
    fixture.nativeElement.querySelector("baw-loading")
  );

  if (visible) {
    expectation.toBeTruthy("Expected Spinner to Exist");
  } else {
    expectation.toBeFalsy("Expected Spinner not to Exist");
  }
}
