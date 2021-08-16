import { IRegion } from "@models/Region";
import { modelData } from "@test/helpers/faker";

export function generateRegion(data?: Partial<IRegion>): Required<IRegion> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    projectId: modelData.id(),
    siteIds: modelData.ids(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
