import camelCase from "lodash.camelcase";
import flow from "lodash.flow";
import kebabCase from "lodash.kebabcase";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";
import * as whitelist from "./whitelist.json";

/**
 * Deeply converts keys of an object from one case to another.
 * Function was created here: https://github.com/travelperk/case-converter
 * @author travelperk
 * @copyright MIT
 * @param oldObject to convert
 * @param converterFunction to convert key.
 * @return converted object
 */
const convertCase = (
  oldObject: any,
  converterFunction: (string?: string) => string,
  convertValue?: boolean
): any => {
  let newObject: any;

  if (
    !oldObject ||
    typeof oldObject !== "object" ||
    !Object.keys(oldObject).length
  ) {
    // Change object value
    return convertValue ? converterFunction(oldObject) : oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject.map(element =>
      convertCase(element, converterFunction)
    );
  } else {
    newObject = {};

    // Change object keys
    Object.keys(oldObject).forEach(oldKey => {
      const newKey = converterFunction(oldKey);
      let whitelisted = false;

      whitelist.keys.map(key => {
        if (newKey === key || oldKey === key) {
          whitelisted = true;
        }
      });

      newObject[newKey] = convertCase(
        oldObject[oldKey],
        converterFunction,
        whitelisted
      );
    });
  }

  return newObject;
};

/**
 * Convert object to camelCase
 * @param obj Object to convert
 */
export const toCamelCase = (obj: any) => convertCase(obj, camelCase);

/**
 * Convert object to snake_case
 * @param obj Object to convert
 */
export const toSnakeCase = (obj: any) => convertCase(obj, snakeCase);

/**
 * Convert object to kebab-case
 * @param obj Object to convert
 */
export const toKebabCase = (obj: any) => convertCase(obj, kebabCase);

/**
 * Convert object to PascalCase
 * @param obj Object to convert
 */
export const toPascalCase = (obj: any) =>
  convertCase(
    obj,
    flow(
      camelCase,
      upperFirst
    )
  );

export default { toCamelCase, toSnakeCase, toKebabCase, toPascalCase };
