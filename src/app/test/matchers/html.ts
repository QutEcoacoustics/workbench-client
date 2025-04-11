import { matcherFailure, matcherSuccess } from ".";
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

const toHaveHref = (): CustomMatcher => ({
  negativeCompare: (target: HTMLAnchorElement): CustomMatcherResult =>
    !target ? matcherSuccess() : matcherFailure("Link should not exist"),
  compare: (target: HTMLAnchorElement, href: string): CustomMatcherResult => {
    if (!target) {
      return matcherFailure("Target element should exist");
    }

    const targetUri = new URL(target.href);
    const expectedUri = new URL(href);

    if (targetUri.toString() !== expectedUri.toString()) {
      return matcherFailure(
        `Expected href to be ${encodeURI(href)}, got ${target.href} instead`
      );
    }
    return matcherSuccess();
  },
});

export const htmlMatchers: CustomMatcherFactories = {
  toHaveHref,
};
