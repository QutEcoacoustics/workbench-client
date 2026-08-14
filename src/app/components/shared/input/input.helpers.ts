import { ValidationErrors } from "@angular/forms";

export function shouldShowError(dirty: boolean, touched: boolean, errors: string[]): boolean {
  return (dirty || touched) && errors.length > 0;
}

export function getErrorMessages(errors: ValidationErrors, errorTypes: Map<string, () => string>): string[] {
  if (!errors) {
    return [];
  }
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  return Object.keys(errors).map((key): string => errorTypes.get(key)());
}
