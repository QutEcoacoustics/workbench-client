import { Params } from "@angular/router";
import { modelData } from "@test/helpers/faker";

export function generateAnnotationMapUrlParameters(data?: Params): Params {
  return {
    focused: modelData.id(),
    ...data,
  };
}

