import { Id } from "@interfaces/apiInterfaces";
import { IDataset } from "@models/Dataset";
import { modelData } from "@test/helpers/faker";

export function generateDataset(id?: Id): Required<IDataset> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    description: modelData.description(),
    descriptionHtml: modelData.descriptionHtml(),
    descriptionHtmlTagline: modelData.descriptionHtml(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
  };
}
