import { IDataset } from "@models/Dataset";
import { modelData } from "@test/helpers/faker";

export function generateDataset(data?: Partial<IDataset>): Required<IDataset> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
