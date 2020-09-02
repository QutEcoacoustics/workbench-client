import { Id } from "@interfaces/apiInterfaces";
import { ITagging } from "@models/Tagging";
import { modelData } from "@test/helpers/faker";

export function generateTagging(id?: Id): Required<ITagging> {
  return {
    id: modelData.id(id),
    audioEventId: modelData.id(),
    tagId: modelData.id(),
    ...modelData.model.generateCreatorAndUpdater(),
  };
}
