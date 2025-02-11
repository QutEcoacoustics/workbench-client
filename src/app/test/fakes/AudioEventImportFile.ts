import { IAudioEventImportFile } from "@models/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import { generateImportedAudioEvent } from "./ImportedAudioEvent";

export function generateAudioEventImportFile(
  data?: Partial<IAudioEventImportFile>
): Required<IAudioEventImportFile> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    fileHash: modelData.param(),
    path: modelData.system.filePath(),
    createdAt: modelData.dateTime(),
    committed: modelData.bool(),
    importedEvents: modelData.randomArray(5, 20, () =>
      generateImportedAudioEvent()
    ),
    analysisJobsItemId: modelData.id(),
    audioEventImportId: modelData.id(),
    file: modelData.file(),
    additionalTagIds: modelData.ids(),
    ...data,
  };
}
