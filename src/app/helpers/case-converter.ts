import camelCase from "lodash.camelcase";
import flow from "lodash.flow";
import kebabCase from "lodash.kebabcase";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";

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
  converterFunction: (string?: string) => string
): any => {
  let newObject: any;

  if (
    !oldObject ||
    typeof oldObject !== "object" ||
    !Object.keys(oldObject).length
  ) {
    return oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject.map(element =>
      convertCase(element, converterFunction)
    );
  } else {
    newObject = {};
    Object.keys(oldObject).forEach(oldKey => {
      const newKey = converterFunction(oldKey);
      newObject[newKey] = convertCase(oldObject[oldKey], converterFunction);
    });
  }

  return newObject;
};

export const toCamelCase = (obj: any) => convertCase(obj, camelCase);
export const toSnakeCase = (obj: any) => convertCase(obj, snakeCase);
export const toKebabCase = (obj: any) => convertCase(obj, kebabCase);
export const toPascalCase = (obj: any) =>
  convertCase(
    obj,
    flow(
      camelCase,
      upperFirst
    )
  );

export default { toCamelCase, toSnakeCase, toKebabCase, toPascalCase };
