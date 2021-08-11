import { IStudy } from "@models/Study";
import { modelData } from "@test/helpers/faker";

export function generateStudy(data?: Partial<IStudy>): Required<IStudy> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    datasetId: modelData.id(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
