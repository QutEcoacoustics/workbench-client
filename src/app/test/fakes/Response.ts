import { IResponse } from "@models/Response";
import { modelData } from "@test/helpers/faker";

export function generateResponse(
  data?: Partial<IResponse>
): Required<IResponse> {
  return {
    id: modelData.id(),
    data: modelData.notes(),
    datasetItemId: modelData.id(),
    questionId: modelData.id(),
    studyId: modelData.id(),
    ...modelData.model.generateCreator(),
    ...data,
  };
}
