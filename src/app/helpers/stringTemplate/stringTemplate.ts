/**
 * Templates a string by substituting placeholders for tokens later in execution.
 * It is designed to work as the tag function for tagged interpolated strings.
 * @returns A reusable template function that is statically checked for arity and
 * parameter type compatibility with the placeholders from the interpolated string.
 * @param strings The strings around the tokens to template
 * @param placeholders Placeholders that are substituted for token when
 *  templating is done. Note these are transform functions.
 */
export function stringTemplate<T extends ((input: any) => any)[]>(
  strings: TemplateStringsArray,
  ...placeholders: T
) {
  // https://github.com/microsoft/TypeScript/issues/12754 should improve this even more
  return function template(...tokens: { [K in keyof T]: ParamType<T[K]> }) {
    // interleave the strings with the parameters
    const result = Array(strings.length + tokens.length);

    for (let i = 0; i < tokens.length; i++) {
      result[i * 2] = strings[i];
      result[i * 2 + 1] = placeholders[i](tokens[i]);
    }

    result[result.length - 1] = strings[strings.length - 1];

    return result.join("");
  };
}

type ParamType<T> = T extends (arg: infer R) => any ? R : never;
