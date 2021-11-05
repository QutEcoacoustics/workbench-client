import { IProject } from "@models/Project";
import { modelData } from "@test/helpers/faker";

export function generateProject(data?: Partial<IProject>): Required<IProject> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    imageUrls: modelData.imageUrls(),
    image: undefined,
    accessLevel: modelData.accessLevel(),
    ownerIds: modelData.ids(),
    siteIds: modelData.ids(),
    regionIds: modelData.ids(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
