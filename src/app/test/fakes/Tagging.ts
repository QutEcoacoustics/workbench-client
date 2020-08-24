import { Id } from "@interfaces/apiInterfaces";
import { ITagging } from "@models/Tagging";
import { modelData } from "@test/helpers/faker";

export function generateTagging(id?: Id): Required<ITagging> {
  return {
    id: modelData.id(id),
    audioEventId: modelData.id(),
    tagId: modelData.id(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
  };
}
