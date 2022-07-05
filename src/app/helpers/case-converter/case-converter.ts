import camelCase from "just-camel-case";
import snakeCase from "just-snake-case";
// List of allowed keys which should have their values converted
import allowList from "./allow-list.json";

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
      const allowedKeys =
        convertValue ||
        allowList.keys.some((key) => key === newKey || key === oldKey);

      newObject[newKey] = convertCase(oldObject[oldKey], callback, allowedKeys);
    });
  }

  return newObject;
};

/**
 * Convert snake case text into camel case
 * Original version can be found here: https://github.com/microsoft/TypeScript/pull/40580#issuecomment-780187521
 *
 * @author Mikael Waltersson
 */
type ToCamelCase<T> = T extends `${infer A}_${infer B}`
  ? `${Uncapitalize<A>}${Capitalize<ToCamelCase<B>>}`
  : T extends string
  ? Uncapitalize<T>
  : T extends (infer A)[]
  ? ToCamelCase<A>[]
  : T extends object
  ? { [K in keyof T as ToCamelCase<K>]: T[K] }
  : T;

/**
 * Convert camel case text into snake case
 * Original version can be found here: https://github.com/microsoft/TypeScript/pull/40580#issuecomment-780187521
 *
 * @author Mikael Waltersson
 */
type ToSnakeCase<T> = T extends `${infer A}${infer B}${infer C}`
  ? [A, B, C] extends [Lowercase<A>, Exclude<Uppercase<B>, "_">, C]
    ? `${A}_${Lowercase<B>}${ToSnakeCase<C>}`
    : `${Lowercase<A>}${ToSnakeCase<`${B}${C}`>}`
  : T extends string
  ? Lowercase<T>
  : T extends (infer A)[]
  ? ToSnakeCase<A>[]
  : T extends object
  ? { [K in keyof T as ToSnakeCase<K>]: T[K] }
  : T;

/**
 * Convert object to camelCase
 *
 * @param obj Object to convert
 */
export const toCamelCase = <T>(obj: T): ToCamelCase<T> =>
  convertCase(obj, camelCase);

/**
 * Convert object to snake_case
 *
 * @param obj Object to convert
 */
export const toSnakeCase = <T>(obj: T): ToSnakeCase<T> =>
  convertCase(obj, snakeCase);

// TODO Type this function similar to camel and snake case
export function titleCase(str: string): string {
  // https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
  let upper = true;
  let newStr = "";
  for (let i = 0, l = str.length; i < l; i++) {
    if (str[i].match(/\s/)) {
      upper = true;
      newStr += str[i];
      continue;
    }
    newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
    upper = false;
  }
  return newStr;
}

export default { toCamelCase, toSnakeCase, titleCase };
