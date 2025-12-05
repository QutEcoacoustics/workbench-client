import { Injectable, Injector } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import {
  RouterLinkActiveOptions,
  StrongRouteActiveDirective,
} from "@directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { UrlActiveDirective } from "@directives/url/url-active.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Constructor } from "@helpers/advancedTypes";
import { StrongRoute } from "@interfaces/strongRoute";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Ng } from "@test/types/ng";
import { matcherFailure, matcherSuccess } from ".";

import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;
import MatchersUtil = jasmine.MatchersUtil;

declare const ng: Ng;

/**
 * Extracts a directive from a html element
 *
 * @param el HTML Element
 * @param directive Directive to extract
 */
function getDirective<D>(
  el: Element,
  directive: Constructor<unknown>,
): D | undefined {
  return ng.getDirectives(el).find((dir): dir is D => dir instanceof directive);
}

/**
 * Validate attributes of an injectable element match the expected props.
 * Returns undefined if all props match
 *
 * @param injectable Injectable element to validate
 * @param props Expected props
 */
function validateAttributes(
  util: MatchersUtil,
  injectable: any,
  props: Record<string, any>,
): CustomMatcherResult {
  for (const key of Object.keys(props)) {
    const expected = props[key];
    const actual = injectable[key];

    const errorMsg = `Expected ${util.pp(key)} to be ${util.pp(
      expected,
    )}, got ${util.pp(actual)} instead`;

    if (typeof expected === "boolean") {
      const isFalsy = expected === false && !actual;
      const isTruthy = expected === true && !!actual;
      if (!isFalsy && !isTruthy) {
        return matcherFailure(errorMsg);
      }
    } else if (util.equals(expected, actual)) {
      return matcherSuccess();
    } else {
      return matcherFailure(errorMsg);
    }
  }
}

/**
 * Determines if the given element is an `<fa-icon />`, and if so, validates
 * the icon prop matches the expected value
 *
 * @returns Jasmine comparison function
 */
const toHaveIcon = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Icon should not exist"),
  compare: (
    target: HTMLElement,
    icon: IconProp,
    props: Partial<Exclude<FaIconComponent, "icon">> = {},
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const targetIcon = target.querySelector("fa-icon");
    if (!targetIcon) {
      return matcherFailure("Target element does not have icon");
    }

    const component = ng.getComponent<FaIconComponent>(targetIcon);
    const expectedProps = { icon, ...props };

    if (!component) {
      return matcherFailure("FaIconComponent should exist");
    }

    const result = validateAttributes(util, component, expectedProps);
    return result ? result : matcherSuccess();
  },
});

/**
 * Determines if the given element is an `<img />`, and if so, validates that
 * the image has an `AuthenticatedImageDirective` attached, and that both the
 * image and directive props match the expected values
 *
 * @returns Jasmine comparison function
 */
const toHaveImage = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLImageElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Image should not exist"),
  compare: (
    target: HTMLImageElement,
    src: string,
    imageProps: Partial<HTMLImageElement> = {},
    directiveProps: Partial<AuthenticatedImageDirective> = {},
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Image element should exist");
    }

    const imageExpectedProps = { src, ...imageProps };

    const imageResults = validateAttributes(util, target, imageExpectedProps);
    if (imageResults) {
      return imageResults;
    }

    const directive = getDirective<AuthenticatedImageDirective>(
      target,
      AuthenticatedImageDirective,
    );
    if (!directive) {
      return matcherFailure("AuthenticatedImageDirective should exist");
    }

    const directiveResults = validateAttributes(
      util,
      directive,
      directiveProps,
    );
    if (directiveResults) {
      return directiveResults;
    }

    return matcherSuccess();
  },
});

/**
 * Determines if the given element has a tooltip directive attached
 * `<element ngbTooltip="tooltip text" />`, and that the tooltip text matches
 * the expected value
 *
 * @returns Jasmine comparison function
 */
const toHaveTooltip = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLElement): CustomMatcherResult => {
    if (!target) {
      return matcherSuccess();
    }
    const directive = getDirective<NgbTooltip>(target, NgbTooltip);
    return !directive
      ? matcherSuccess()
      : matcherFailure("Tooltip should not exist");
  },
  compare: (
    target: HTMLElement,
    tooltip: string,
    props?: Partial<NgbTooltip>,
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<NgbTooltip>(target, NgbTooltip);
    if (!directive) {
      return matcherFailure("NgbTooltip directive should exist");
    }

    const results = validateAttributes(util, directive, {
      _ngbTooltip: tooltip,
      ...props,
    });
    return results ? results : matcherSuccess();
  },
});

/**
 * Determines if the anchor element has a router link directive attached
 * `<a routerLink="/path" />` and that the directives props match the expected
 * values
 *
 * @returns Jasmine comparison function
 */
const toHaveRoute = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (
    target: HTMLAnchorElement,
    routerLink: string,
    props: Partial<Exclude<RouterLink, "routerLink">>,
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<RouterLink>(target, RouterLink);
    if (!directive) {
      return matcherFailure("RouterLinkWithHref directive should exist");
    }

    const results = validateAttributes(util, directive, {
      routerLink,
      ...props,
    });
    return results ? results : matcherSuccess();
  },
});

/**
 * Determines if the anchor element has a strong route directive attached
 * `<a strongRoute="/path" />` and that the directives props match the expected
 * values
 *
 * @returns Jasmine comparison function
 */
const toHaveStrongRoute = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (
    target: HTMLAnchorElement,
    strongRoute: StrongRoute,
    props: Partial<Exclude<StrongRouteDirective, "strongRoute">>,
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<StrongRouteDirective>(
      target,
      StrongRouteDirective,
    );
    if (!directive) {
      return matcherFailure("StrongRouteDirective should exist");
    }

    const results = validateAttributes(util, directive, {
      strongRoute,
      ...props,
    });
    return results ? results : matcherSuccess();
  },
});

/**
 * Determines if the anchor element has a strong route active directive
 * attached `<a strongRouteActiveActive="className" />` and that the directives
 * props match the expected values
 *
 * @returns Jasmine comparison function
 */
const toHaveStrongRouteActive = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (
    target: HTMLAnchorElement,
    klass: string = "active",
    options: RouterLinkActiveOptions = { exact: false },
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<StrongRouteActiveDirective>(
      target,
      StrongRouteActiveDirective,
    );
    if (!directive) {
      return matcherFailure("StrongRouteActiveDirective should exist");
    }

    const results = validateAttributes(util, directive, {
      strongRouteActive: klass,
      strongRouteActiveOptions: options,
    });
    return results ? results : matcherSuccess();
  },
});

const toHaveUrl = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (
    target: HTMLAnchorElement,
    bawUrl: string,
    props: Partial<Exclude<UrlDirective, "bawUrl">>,
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<UrlDirective>(target, UrlDirective);
    if (!directive) {
      return matcherFailure("UrlDirective should exist");
    }

    const results = validateAttributes(util, directive, { bawUrl, ...props });
    return results ? results : matcherSuccess();
  },
});

const toHaveUrlActive = (util: MatchersUtil): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (
    target: HTMLAnchorElement,
    klass: string = "active",
    options: RouterLinkActiveOptions = { exact: false },
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const directive = getDirective<UrlActiveDirective>(
      target,
      UrlActiveDirective,
    );
    if (!directive) {
      return matcherFailure("UrlActiveDirective should exist");
    }

    const results = validateAttributes(util, directive, {
      routerLinkActive: klass,
      routerLinkActiveOptions: options,
    });
    return results ? results : matcherSuccess();
  },
});

/**
 * Expect an injectable to be provided by a specific injector
 * This can be useful for testing services that are provided by multiple
 * injectors
 */
const toBeProvidedBy = (): CustomMatcher => ({
  negativeCompare: (target: Injectable): CustomMatcherResult =>
    target
      ? matcherSuccess()
      : matcherFailure("Expected target to be provided by"),
  compare: (
    target: Injectable,
    expectedInjector: Injector,
  ): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Injectable was not defined");
    }

    const actualInjector = target["injector"];
    if (!actualInjector) {
      return matcherFailure("Injectable does not have a provider");
    }

    return actualInjector === expectedInjector
      ? matcherSuccess()
      : matcherFailure("Injectable was not provided by expected injector");
  },
});

export const injectableMatchers: CustomMatcherFactories = {
  toHaveIcon,
  toHaveImage,
  toHaveTooltip,
  toHaveRoute,
  toHaveStrongRoute,
  toHaveStrongRouteActive,
  toHaveUrl,
  toHaveUrlActive,
  toBeProvidedBy,
};
