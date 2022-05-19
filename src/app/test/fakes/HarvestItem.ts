import {
  HarvestItemState,
  IHarvestItem,
  IHarvestItemValidation,
} from "@models/HarvestItem";
import { modelData } from "@test/helpers/faker";

export function generateHarvestItemValidation(
  data?: Partial<IHarvestItemValidation>
): Required<IHarvestItemValidation> {
  return {
    name: modelData.random.word(),
    status: modelData.random.arrayElement(["fixable", "notFixable"]),
    message: modelData.random.words(),
    ...data,
  };
}

export function generateHarvestItem(
  data?: Partial<IHarvestItem>
): Required<IHarvestItem> {
  const validations = Array(modelData.datatype.number({ min: 0, max: 3 }))
    .fill(0)
    .map(() => generateHarvestItemValidation());

  const status: HarvestItemState = validations.find(
    (v) => v.status === "notFixable"
  )
    ? "failed"
    : "completed";

  return {
    id: modelData.id(),
    harvestId: modelData.id(),
    audioRecordingId: modelData.id(),
    deleted: modelData.datatype.boolean(),
    path: modelData.system.filePath(),
    status,
    createdAt: modelData.timestamp(),
    uploadedAt: modelData.timestamp(),
    uploaderId: modelData.id(),
    validations,
    ...data,
  };
}
