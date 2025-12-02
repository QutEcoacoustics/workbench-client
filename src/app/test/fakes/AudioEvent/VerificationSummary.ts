import { IVerificationSummary } from "@models/AudioEvent/VerificationSummary";
import { modelData } from "@test/helpers/faker";

export function generateVerificationSummary(
  data?: Partial<IVerificationSummary>,
): IVerificationSummary {
  return {
    tagId: modelData.id(),
    count: modelData.datatype.number(),
    correct: modelData.datatype.number(),
    incorrect: modelData.datatype.number(),
    unsure: modelData.datatype.number(),
    skip: modelData.datatype.number(),
    ...data,
  };
}
