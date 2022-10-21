import { Harvest, HarvestStatus } from "@models/Harvest";
import { generateHarvest } from "@test/fakes/Harvest";

describe("isAbortable", () => {
  const createModel = (harvestStatus: HarvestStatus) =>
    new Harvest(generateHarvest({ status: harvestStatus }));

  const transitionalHarvestStates: HarvestStatus[] = [
    "metadataReview",
    "uploading",
    "newHarvest"
  ];

  const notTransitionalHarvestStates: HarvestStatus[] = [
    "scanning",
    "metadataExtraction",
    "processing",
    "complete"
  ];

  transitionalHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return true for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).isAbortable()).toBeTrue();
    });
  });

  notTransitionalHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return false for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).isAbortable()).toBeFalse();
    });
  });
});
