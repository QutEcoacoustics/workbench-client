import { Id } from "@interfaces/apiInterfaces";
import { IDatasetItem } from "@models/DatasetItem";
import { modelData } from "@test/helpers/faker";

export function generateDatasetItem(id?: Id): Required<IDatasetItem> {
  const [startTimeSeconds, endTimeSeconds] = modelData.startEndSeconds();

  return {
    id: modelData.id(id),
    datasetId: modelData.id(),
    audioRecordingId: modelData.id(),
    startTimeSeconds,
    endTimeSeconds,
    order: modelData.random.number(100),
    ...modelData.model.generateCreator(),
  };
}
