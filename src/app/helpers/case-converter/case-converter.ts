import camelCase from "just-camel-case";
import snakeCase from "just-snake-case";

// List of whitelist keys which should have their values converted
import * as whitelist from "./whitelist.json";

/**
 * Deeply converts keys of an object from one case to another.
 * Function was created here: https://github.com/travelperk/case-converter (repo no longer exists)
 *
 * @copyright MIT
 * @author travelperk
 * @param oldObject to convert
 * @param callback to convert key.
 * @return converted object
 */
const convertCase = (
  oldObject: any,
  callback: (callbackVal?: string) => string,
  convertValue?: boolean
): any => {
  let newObject: any;

  // Prevent conversion of periods (.)
  function converterFn(valToConvert?: string): string {
    return valToConvert
      .split(".")
      .map((split) => callback(split))
      .join(".");
  }

  if (
    !oldObject ||
    typeof oldObject !== "object" ||
    !Object.keys(oldObject).length
  ) {
    // Change object value
    return convertValue ? converterFn(oldObject) : oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject.map((element) =>
      convertCase(element, callback, convertValue)
    );
  } else {
    newObject = {};

    // Change object keys
    Object.keys(oldObject).forEach((oldKey) => {
      const newKey = converterFn(oldKey);
      const whitelisted =
        convertValue ||
        whitelist.keys.some((key) => key === newKey || key === oldKey);

      newObject[newKey] = convertCase(oldObject[oldKey], callback, whitelisted);
    });
  }

  return newObject;
};

/**
 * Convert object to camelCase
 *
 * @param obj Object to convert
 */
export const toCamelCase = (obj: any) => convertCase(obj, camelCase);

/**
 * Convert object to snake_case
 *
 * @param obj Object to convert
 */
export const toSnakeCase = (obj: any) => convertCase(obj, snakeCase);

export default { toCamelCase, toSnakeCase };
