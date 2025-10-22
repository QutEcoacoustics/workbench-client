import { Params } from "@angular/router";
import { modelData } from "@test/helpers/faker";

export function generateVerificationUrlParams(): Params {
  return {
    taskTag: modelData.id().toString(),
    taskBehavior: modelData.helpers.arrayElement([
      "verify",
      "verify-and-correct-tag",
    ]),
  };
}
