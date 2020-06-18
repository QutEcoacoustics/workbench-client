import { Id } from "@interfaces/apiInterfaces";
import { IProgressEvent } from "@models/ProgressEvent";
import { modelData } from "@test/helpers/faker";

export function generateProgressEvent(id?: Id): IProgressEvent {
  return {
    id: modelData.id(id),
    creatorId: modelData.id(),
    datasetItemId: modelData.id(),
    activity: modelData.random.arrayElement(["viewed", "played", "annotated"]),
    createdAt: modelData.timestamp(),
  };
}
