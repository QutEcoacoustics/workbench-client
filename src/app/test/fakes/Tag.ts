import { ITag } from "@models/Tag";
import { modelData } from "@test/helpers/faker";

export function generateTag(data?: Partial<ITag>): Required<ITag> {
  const tagTypes = [
    "general",
    "common_name",
    "species_name",
    "looks_like",
    "sounds_like",
  ];

  return {
    id: modelData.id(),
    text: modelData.param(),
    isTaxonomic: modelData.bool(),
    typeOfTag: modelData.random.arrayElement(tagTypes),
    retired: modelData.bool(),
    notes: modelData.notes(),
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}
