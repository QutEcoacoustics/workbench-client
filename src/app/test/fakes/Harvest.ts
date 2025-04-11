import { HarvestStatus, IHarvest, IHarvestMapping, IHarvestReport } from "@models/Harvest";
import { modelData } from "@test/helpers/faker";

export function generateHarvestMapping(data?: Partial<IHarvestMapping>): Required<IHarvestMapping> {
  return {
    path: modelData.system.filePath(),
    siteId: modelData.id(),
    utcOffset: modelData.helpers.arrayElement(["-10:00", "00:00", "+10:00"]),
    recursive: modelData.datatype.boolean(),
    ...data,
  };
}

export function generateHarvestReport(data?: Partial<IHarvestReport>): Required<IHarvestReport> {
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
    latestActivityAt: modelData.timestamp(),
    runTimeSeconds: modelData.datatype.number(),
    ...data,
  };
}

export function generateHarvest(data?: Partial<IHarvest>): Required<IHarvest> {
  return {
    id: modelData.id(),
    name: modelData.random.word(),
    streaming: modelData.datatype.boolean(),
    status: modelData.helpers.arrayElement<HarvestStatus>([
      "uploading",
      "metadataExtraction",
      "metadataReview",
      "processing",
      "complete",
    ]),
    projectId: modelData.id(),
    uploadPassword: modelData.internet.password(),
    uploadUser: modelData.internet.userName(),
    uploadUrl: `sftp://${modelData.random.word()}.${modelData.random.word()}.org:2020`,
    mappings: Array(modelData.datatype.number({ min: 0, max: 3 })).map(() => generateHarvestMapping()),
    report: generateHarvestReport(),
    lastMetadataReviewAt: modelData.timestamp(),
    lastMappingsChangeAt: modelData.timestamp(),
    lastUploadAt: modelData.timestamp(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
