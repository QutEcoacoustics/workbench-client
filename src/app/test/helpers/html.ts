import { DebugElement } from "@angular/core";
import { ComponentFixture, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { PartialWith } from "@helpers/advancedTypes";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Ng } from "@test/types/ng";

declare const ng: Ng;

/**
 * Extracts a directive from a html element
 *
 * @param el HTML Element
 * @param directive Directive to extract
 */
function getDirective<D>(el: HTMLElement, directive: any): D | undefined {
  return ng.getDirectives(el).find((dir): dir is D => dir instanceof directive);
}

/**
 * Assert icon
 *
 * @param target Target element
 * @param props FaIconComponent properties
 */
export function assertIcon(
  target: HTMLElement,
  props: PartialWith<FaIconComponent, "icon">
): void {
  const icon: HTMLElement = target.querySelector("fa-icon");
  expect(icon).toBeTruthy("No icon detected");
  const component = ng.getComponent<FaIconComponent>(icon);
  Object.keys(props).forEach((key) => {
    expect(component[key]).toEqual(props[key]);
  });
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
): void {
  expect(target).toBeTruthy("Image should exist");
  expect(target.src).toBe(src);
  expect(target.alt).toBe(alt);

  const imageDirective = getDirective<AuthenticatedImageDirective>(
    target,
    AuthenticatedImageDirective
  );

  if (!isUnauthenticated) {
    expect(imageDirective).toBeTruthy();
  } else if (imageDirective) {
    expect(imageDirective);
  } else {
    expect(imageDirective.disableAuth).toBeTrue();
  }
}

/**
 * Assert html element tooltip
 *
 * @param target Target element
 * @param tooltip Tooltip text
 */
export function assertTooltip(target: HTMLElement, tooltip: string): void {
  expect(target).toBeTruthy("No tooltip detected");
  const directive = getDirective<NgbTooltip>(target, NgbTooltip);
  expect(directive).toBeTruthy("No tooltip directive detected");
  expect(directive.ngbTooltip).toContain(tooltip);
}

export function assertHref(target: HTMLAnchorElement, href: string): void {
  expect(target).toBeTruthy("No link detected");
  expect(target).toHaveAttribute("href", encodeURI(href));
}

/**
 * Assert router link
 *
 * @param target Target element
 * @param route Route text
 */
export function assertRoute(target: HTMLElement, route: string): void {
  expect(target).toBeTruthy("No HTML element detected");
  const directive = getDirective<RouterLinkWithHref>(
    target,
    RouterLinkWithHref
  );
  expect(directive).toBeTruthy("No route directive detected");
  expect(directive.routerLink).toBe(route);
}

/**
 * Assert strong route link directive is set
 *
 * @param target HTML anchor element
 * @param props StrongRouteDirective properties
 */
export function assertStrongRouteLink(
  target: HTMLAnchorElement,
  props: PartialWith<StrongRouteDirective, "strongRoute">
): void {
  expect(target).toBeTruthy("No HTML element detected");
  const directive = getDirective<StrongRouteDirective>(
    target,
    StrongRouteDirective
  );
  expect(directive).toBeTruthy("No strong route directive detected");
  Object.keys(props).forEach((key) => {
    expect(directive[key]).toEqual(props[key]);
  });
}

/**
 * Assert strong route link active directive is set
 *
 * @param target HTML anchor element
 */
export function assertStrongRouteActive(target: HTMLAnchorElement): void {
  expect(target).toBeTruthy("No HTML element detected");
  const directive = getDirective<StrongRouteDirective>(
    target,
    StrongRouteDirective
  );
  expect(directive).toBeTruthy("No strong route active directive detected");
}

/**
 * Assert url link
 *
 * @param target HTML anchor element
 * @param props UrlDirective properties
 */
export function assertUrl(
  target: HTMLAnchorElement,
  props: PartialWith<UrlDirective, "bawUrl">
): void {
  expect(target).toBeTruthy("No HTML element detected");
  const directive = getDirective<UrlDirective>(target, UrlDirective);
  expect(directive).toBeTruthy("No url directive detected");
  Object.keys(props).forEach((key) => {
    expect(directive[key]).toEqual(props[key]);
  });
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
