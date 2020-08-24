import { Id } from "@interfaces/apiInterfaces";
import { IBookmark } from "@models/Bookmark";
import { modelData } from "@test/helpers/faker";

export function generateBookmark(id?: Id): Required<IBookmark> {
  return {
    id: modelData.id(id),
    audioRecordingId: modelData.id(),
    offsetSeconds: modelData.seconds(),
    name: modelData.param(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    description: modelData.description(),
    descriptionHtml: modelData.descriptionHtml(),
    category: "<< application >>", // TODO Replace with list of possibilities
  };
}
