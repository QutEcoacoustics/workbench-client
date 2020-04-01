/**
 * Determines if variable is null or undefined
 * @param variable Variable to validate
 */
export function isUninitialized(variable: any): boolean {
  // tslint:disable-next-line: triple-equals
  return variable == null; // Same as checking === null and === undefined
}
