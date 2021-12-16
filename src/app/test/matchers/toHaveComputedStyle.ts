import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

/**
 * Custom matchers use a combination of the following resources:
 * https://stackoverflow.com/questions/42956195/create-custom-jasmine-matcher-using-typescript
 * https://jasmine.github.io/tutorials/custom_matcher
 *
 * Remember to update matcher-types.d.ts when making changes
 */

type StyleValue = string | number;

function validateStyles(
  actual: HTMLElement,
  expected: Partial<CSSStyleDeclaration>,
  callback: (
    key: string,
    actualStyle: StyleValue,
    expectedStyle: StyleValue
  ) => CustomMatcherResult
): CustomMatcherResult {
  const computedStyle = getComputedStyle(actual);

  /*
   * For each expected value, compare to computed value, and return if
   * miss match detected
   */
  Object.entries(expected).forEach(([key, value]) => {
    const computedValue = computedStyle[key];
    const result = callback(key, computedValue, value as StyleValue);
    if (!result.pass) {
      return result;
    }
  });

  return { pass: true };
}

export const computedStyleMatchers: CustomMatcherFactories = {
  /**
   * Determines if the computed style of an element matches the expected values
   *
   * @param util Jasmine matcher utilities
   * @returns Jasmine comparison function
   */
  toHaveComputedStyle(): CustomMatcher {
    return {
      negativeCompare: (
        actual: HTMLElement,
        expected: Partial<CSSStyleDeclaration>
      ): CustomMatcherResult =>
        validateStyles(actual, expected, (key, actualStyle, expectedStyle) =>
          actualStyle !== expectedStyle
            ? { pass: true }
            : {
                pass: false,
                message: `Expected ${key} to be not be equal to ${expectedStyle}`,
              }
        ),
      compare: (
        actual: HTMLElement,
        expected: Partial<CSSStyleDeclaration>
      ): CustomMatcherResult =>
        validateStyles(actual, expected, (key, actualStyle, expectedStyle) =>
          actualStyle === expectedStyle
            ? { pass: true }
            : {
                pass: false,
                message: `Expected ${key} to be equal to ${expectedStyle}, got ${actualStyle} instead`,
              }
        ),
    };
  },
};
