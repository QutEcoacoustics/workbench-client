import { Id } from "@interfaces/apiInterfaces";
import { ISavedSearch } from "@models/SavedSearch";
import { modelData } from "@test/helpers/faker";

export function generateSavedSearch(id?: Id): ISavedSearch {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    description: modelData.description(),
    storedQuery: { uuid: { eq: "blah blah" } }, // TODO Implement with random values
    creatorId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
  };
}
