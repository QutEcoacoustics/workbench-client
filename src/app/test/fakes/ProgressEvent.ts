import { IProgressEvent } from "@models/ProgressEvent";
import { modelData } from "@test/helpers/faker";

export function generateProgressEvent(
  data?: Partial<IProgressEvent>
): Required<IProgressEvent> {
  return {
    id: modelData.id(),
    datasetItemId: modelData.id(),
    activity: modelData.helpers.arrayElement(["viewed", "played", "annotated"]),
    ...modelData.model.generateCreator(),
    ...data,
  };
}
