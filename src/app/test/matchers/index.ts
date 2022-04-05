import CustomMatcherResult = jasmine.CustomMatcherResult;
/*
 * Custom matchers use a combination of the following resources:
 * https://stackoverflow.com/questions/42956195/create-custom-jasmine-matcher-using-typescript
 * https://jasmine.github.io/tutorials/custom_matcher
 *
 * Remember to update matcher-types.d.ts when making changes
 */

export function matcherSuccess(): CustomMatcherResult {
  return { pass: true };
}

export function matcherFailure(message: string): CustomMatcherResult {
  return { pass: false, message };
}
