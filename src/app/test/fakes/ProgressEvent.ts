import { Id } from "@interfaces/apiInterfaces";
import { IProgressEvent } from "@models/ProgressEvent";
import { modelData } from "@test/helpers/faker";

export function generateProgressEvent(id?: Id): IProgressEvent {
  return {
    id: modelData.id(id),
    creatorId: modelData.id(),
    datasetItemId: modelData.id(),
    activity: "viewed", // TODO Replace with list of possibilities
    createdAt: modelData.timestamp(),
  };
}
