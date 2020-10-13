import { Id } from "@interfaces/apiInterfaces";
import { IProject } from "@models/Project";
import { modelData } from "@test/helpers/faker";

export function generateProject(id?: Id): Required<IProject> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    accessLevel: modelData.accessLevel(),
    ownerId: modelData.id(),
    siteIds: modelData.ids(),
    regionIds: modelData.ids(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
  };
}
