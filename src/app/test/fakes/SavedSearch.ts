import { ISavedSearch } from "@models/SavedSearch";
import { modelData } from "@test/helpers/faker";

export function generateSavedSearch(
  data?: Partial<ISavedSearch>
): Required<ISavedSearch> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    storedQuery: { uuid: { eq: "blah blah" } }, // TODO Implement with random values
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreatorAndDeleter(),
    ...data,
  };
}
