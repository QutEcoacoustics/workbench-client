// TODO: If needed, add support for parsing numerical separators like _ and ,
/**
 * A function to convert a string to a number.
 * This function will return "null" if the string is not a valid number.
 *
 * For more information, about decisions made in this function and why this
 * function is needed, see the Google TypeScript style guide.
 * https://google.github.io/styleguide/tsguide.html#type-coercion
 *
 * @param stringValue A string to convert to a number
 * @returns
 * A number if the string is a valid number or "null" if the number is not valid
 */
export function toNumber<T extends string>(stringValue: T): number | null {
  // Some values such as an empty string will incorrectly convert to a number
  // value of 0 when using the number constructor.
  // We special case these cases and return "null" indicating that they are not
  // numbers.
  if (
    stringValue === "" ||
    stringValue === " " ||
    stringValue === "\t" ||
    stringValue === "\n" ||
    stringValue === "\r"
  ) {
    return null;
  }

  // Strings such as "Infinity" and values greater than 1e+309 will expand out
  // to Infinity which is a number meaning that if we didn't include the
  // isFinite condition, "Infinity" would be incorrectly returned.
  //
  // We use the Number constructor here instead of parseInt, because parseInt
  // will unexpectedly extract the first number from a string, regularly returns
  // unexpected numbers in an attempt not to throw errors, and does not support
  // numeric separators.
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#using_parseint
  const value = Number(stringValue);
  if (isNaN(value) || !isFinite(value)) {
    return null;
  }

  return value;
}
