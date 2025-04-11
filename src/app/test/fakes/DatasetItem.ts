import { IDatasetItem } from "@models/DatasetItem";
import { modelData } from "@test/helpers/faker";

export function generateDatasetItem(
  data?: Partial<IDatasetItem>
): Required<IDatasetItem> {
  const [startTimeSeconds, endTimeSeconds] = modelData.startEndSeconds();

  return {
    id: modelData.id(),
    datasetId: modelData.id(),
    audioRecordingId: modelData.id(),
    startTimeSeconds,
    endTimeSeconds,
    order: modelData.datatype.number(100),
    ...modelData.model.generateCreator(),
    ...data,
  };
}
