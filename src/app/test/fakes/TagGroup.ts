import { ITagGroup } from "@models/TagGroup";
import { modelData } from "@test/helpers/faker";

export function generateTagGroup(
  data?: Partial<ITagGroup>
): Required<ITagGroup> {
  return {
    id: modelData.id(),
    groupIdentifier: modelData.param(),
    tagId: modelData.id(),
    ...modelData.model.generateCreator(),
    ...data,
  };
}
