import { Id } from '@interfaces/apiInterfaces';
import { IResponse } from '@models/Response';
import { modelData } from '@test/helpers/faker';

export function generateResponse(id?: Id): Required<IResponse> {
  return {
    id: modelData.id(id),
    data: modelData.notes(),
    datasetItemId: modelData.id(),
    questionId: modelData.id(),
    studyId: modelData.id(),
    ...modelData.model.generateCreator(),
  };
}
