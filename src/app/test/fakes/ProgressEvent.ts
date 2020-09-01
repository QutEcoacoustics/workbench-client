import { Id } from "@interfaces/apiInterfaces";
import { IProgressEvent } from "@models/ProgressEvent";
import { modelData } from "@test/helpers/faker";

export function generateProgressEvent(id?: Id): Required<IProgressEvent> {
  return {
    id: modelData.id(id),
    datasetItemId: modelData.id(),
    activity: modelData.random.arrayElement(["viewed", "played", "annotated"]),
    ...modelData.model.generateCreator(),
  };
}
