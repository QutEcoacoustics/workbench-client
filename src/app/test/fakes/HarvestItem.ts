import {
  HarvestItemState,
  IHarvestItem,
  IHarvestItemReport,
  IHarvestItemValidation,
} from "@models/HarvestItem";
import { modelData } from "@test/helpers/faker";

export function generateHarvestItemValidation(
  data?: Partial<IHarvestItemValidation>
): Required<IHarvestItemValidation> {
  return {
    name: modelData.random.word(),
    status: modelData.helpers.arrayElement(["fixable", "notFixable"]),
    message: modelData.random.words(),
    ...data,
  };
}

export function generateHarvestReport(
  data?: Partial<IHarvestItemReport>
): Required<IHarvestItemReport> {
  return {
    itemsTotal: modelData.datatype.number(),
    itemsSizeBytes: modelData.datatype.number(),
    itemsDurationSeconds: modelData.datatype.number(),
    itemsInvalidFixable: modelData.datatype.number(),
    itemsInvalidNotFixable: modelData.datatype.number(),
    itemsNew: modelData.datatype.number(),
    itemsMetadataGathered: modelData.datatype.number(),
    itemsFailed: modelData.datatype.number(),
    itemsCompleted: modelData.datatype.number(),
    itemsErrored: modelData.datatype.number(),
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
    uploaderId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deleted: modelData.datatype.boolean(),
    // File path without leading '/'
    path: modelData.system.filePath().slice(1),
    status,
    validations,
    report: generateHarvestReport(),
    ...data,
  };
}
