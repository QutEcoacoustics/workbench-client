import { Params } from "@angular/router";

export function mergeParameters<
  const Base extends Params,
  const Override extends Params,
>(base: Base, ...overrides: Override[]) {
  return Object.assign({}, base, ...overrides);
}
