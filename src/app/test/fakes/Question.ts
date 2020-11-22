import { Id } from '@interfaces/apiInterfaces';
import { IQuestion } from '@models/Question';
import { modelData } from '@test/helpers/faker';

export function generateQuestion(id?: Id): Required<IQuestion> {
  return {
    id: modelData.id(id),
    text: modelData.html(),
    data: modelData.notes(),
    ...modelData.model.generateCreatorAndUpdater(),
  };
}
