import { Id } from "@interfaces/apiInterfaces";
import { IStudy } from "@models/Study";
import { modelData } from "@test/helpers/faker";

export function generateStudy(id?: Id): Required<IStudy> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    datasetId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
  };
}
