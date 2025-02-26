import { ConfirmedStatus, IVerification } from "@models/Verification";
import { modelData } from "@test/helpers/faker";

export function generateVerification(data?: Partial<IVerification>): Required<IVerification> {
  return {
    id: modelData.id(),
    confirmed: modelData.helpers.arrayElement(Object.values(ConfirmedStatus)),
    tagId: modelData.id(),
    audioEventId: modelData.id(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
