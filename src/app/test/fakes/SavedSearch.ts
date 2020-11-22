import { Id } from "@interfaces/apiInterfaces";
import { ISavedSearch } from "@models/SavedSearch";
import { modelData } from "@test/helpers/faker";

export function generateSavedSearch(id?: Id): Required<ISavedSearch> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    storedQuery: { uuid: { eq: "blah blah" } }, // TODO Implement with random values
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreatorAndDeleter(),
  };
}
