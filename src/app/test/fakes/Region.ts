import { Id } from "@interfaces/apiInterfaces";
import { IRegion } from "@models/Region";
import { modelData } from "@test/helpers/faker";

export function generateRegion(id?: Id): Required<IRegion> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    projectId: modelData.id(),
    siteIds: modelData.ids(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
  };
}
