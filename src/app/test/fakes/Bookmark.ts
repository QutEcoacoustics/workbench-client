import { Id } from '@interfaces/apiInterfaces';
import { IBookmark } from '@models/Bookmark';
import { modelData } from '@test/helpers/faker';

export function generateBookmark(id?: Id): Required<IBookmark> {
  return {
    id: modelData.id(id),
    audioRecordingId: modelData.id(),
    offsetSeconds: modelData.seconds(),
    name: modelData.param(),
    category: '<< application >>', // TODO Replace with list of possibilities
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreatorAndUpdater(),
  };
}
