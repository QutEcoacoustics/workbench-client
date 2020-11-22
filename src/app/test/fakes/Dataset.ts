import { Id } from "@interfaces/apiInterfaces";
import { IDataset } from "@models/Dataset";
import { modelData } from "@test/helpers/faker";

export function generateDataset(id?: Id): Required<IDataset> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreatorAndUpdater(),
  };
}
