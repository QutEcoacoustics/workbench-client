import { Harvest, HarvestStatus } from "@models/Harvest";
import { generateHarvest } from "@test/fakes/Harvest";

const createModel = (harvestStatus: HarvestStatus) => new Harvest(generateHarvest({ status: harvestStatus }));

describe("isAbortable", () => {
  const abortableHarvestStates: HarvestStatus[] = ["metadataReview", "uploading", "newHarvest"];

  const notAbortableHarvestStates: HarvestStatus[] = ["scanning", "metadataExtraction", "processing", "complete"];

  abortableHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return true for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).isAbortable()).toBeTrue();
    });
  });

  notAbortableHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return false for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).isAbortable()).toBeFalse();
    });
  });
});

describe("canUpdate", () => {
  const transitionableHarvestStates: HarvestStatus[] = ["metadataReview", "uploading", "newHarvest", "complete"];

  const notTransitionableHarvestStates: HarvestStatus[] = ["scanning", "metadataExtraction", "processing"];

  transitionableHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return true for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).canUpdate).toBeTrue();
    });
  });

  notTransitionableHarvestStates.forEach((harvestStatus: HarvestStatus) => {
    it(`should return false for a Harvest with the status of ${harvestStatus}`, () => {
      expect(createModel(harvestStatus).canUpdate).toBeFalse();
    });
  });
});
