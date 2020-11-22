/**
 * Determine if value is instantiated, used to simplify null checking
 *
 * @param value Value to evaluate
 */
export function isInstantiated<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
