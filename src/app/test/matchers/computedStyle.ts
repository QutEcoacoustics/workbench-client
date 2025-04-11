import { matcherFailure, matcherSuccess } from ".";
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

type StyleValue = string | number;

function validateStyles(
  actual: HTMLElement,
  expected: Partial<CSSStyleDeclaration>,
  callback: (key: string, actualStyle: StyleValue, expectedStyle: StyleValue) => CustomMatcherResult,
): CustomMatcherResult {
  if (!actual) {
    return matcherFailure("HTMLElement is undefined");
  } else if (!(actual instanceof HTMLElement)) {
    return matcherFailure(`Input must be of type HTMLElement, got ${(actual as any).constructor.name} instead`);
  } else if (!document.body.contains(actual)) {
    return matcherFailure("HTMLElement does not exist in the DOM");
  }

  const computedStyle = getComputedStyle(actual);

  /*
   * For each expected value, compare to computed value, and return if
   * miss match detected
   */
  const failures = [];
  for (const [key, value] of Object.entries(expected)) {
    const computedValue = computedStyle[key];
    const result = callback(key, computedValue, value as StyleValue);
    if (!result.pass) {
      failures.push(result.message);
    }
  }

  // Return aggregation of failure messages
  if (failures.length > 0) {
    return matcherFailure(failures.join("\n"));
  }

  return matcherSuccess();
}

export const computedStyleMatchers: CustomMatcherFactories = {
  /**
   * Determines if the computed style of an element matches the expected values
   *
   * @returns Jasmine comparison function
   */
  toHaveComputedStyle(): CustomMatcher {
    return {
      negativeCompare: (actual: HTMLElement, expected: Partial<CSSStyleDeclaration>): CustomMatcherResult =>
        validateStyles(actual, expected, (key, actualStyle, expectedStyle) =>
          actualStyle !== expectedStyle
            ? matcherSuccess()
            : matcherFailure(`Expected ${key} to be not be equal to ${expectedStyle}`),
        ),
      compare: (actual: HTMLElement, expected: Partial<CSSStyleDeclaration>): CustomMatcherResult =>
        validateStyles(actual, expected, (key, actualStyle, expectedStyle) =>
          actualStyle === expectedStyle
            ? matcherSuccess()
            : matcherFailure(`Expected ${key} to be equal to ${expectedStyle}, got ${actualStyle} instead`),
        ),
    };
  },
};
