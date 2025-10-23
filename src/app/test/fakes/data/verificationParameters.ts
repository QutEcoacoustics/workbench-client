import { Params } from "@angular/router";
import { TaskBehaviorKey, VerificationStatusKey } from "@components/annotations/components/verification-form/verificationParameters";
import { modelData } from "@test/helpers/faker";

export function generateVerificationUrlParams(data?: Params): Params {
  return {
    taskTag: modelData.id().toString(),
    taskBehavior: modelData.helpers.arrayElement<TaskBehaviorKey>([
      "verify",
      "verify-and-correct-tag",
    ]),
    verificationStatus: modelData.helpers.arrayElement<VerificationStatusKey>([
      "unverified-for-me",
      "unverified",
      "any",
    ]),
    ...data,
  };
}
