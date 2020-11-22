import { Id } from '@interfaces/apiInterfaces';
import { IStudy } from '@models/Study';
import { modelData } from '@test/helpers/faker';

export function generateStudy(id?: Id): Required<IStudy> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    datasetId: modelData.id(),
    ...modelData.model.generateCreatorAndUpdater(),
  };
}
