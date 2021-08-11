import { ITagging } from "@models/Tagging";
import { modelData } from "@test/helpers/faker";

export function generateTagging(data?: Partial<ITagging>): Required<ITagging> {
  return {
    id: modelData.id(),
    audioEventId: modelData.id(),
    tagId: modelData.id(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
