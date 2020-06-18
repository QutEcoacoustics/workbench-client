import { Id } from "@interfaces/apiInterfaces";
import { ITag } from "@models/Tag";
import { modelData } from "@test/helpers/faker";

export function generateTag(id?: Id): ITag {
  return {
    id: modelData.id(id),
    text: modelData.param(),
    isTaxanomic: modelData.boolean(),
    typeOfTag: modelData.random.arrayElement([
      "general",
      "common_name",
      "species_name",
      "looks_like",
      "sounds_like",
    ]),
    retired: modelData.boolean(),
    notes: modelData.notes(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
  };
}
