import { IAudioEventImportFile } from "@models/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import { generateImportedAudioEvent } from "./AudioEventImport/ImportedAudioEvent";

export function generateAudioEventImportFile(
  data: Partial<IAudioEventImportFile> = {}
): IAudioEventImportFile {
  if (data.file && data.path) {
    throw new Error(
      "Cannot provide both file and path to mock AudioEventImportFile"
    );
  }

  const useMockFile = !data.file && !data.path ? !!data.file : modelData.bool();
  const mockFileData = useMockFile
    ? { file: data.file ?? modelData.file() }
    : { path: data.path ?? modelData.system.filePath() };

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
    additionalTagIds: modelData.ids(),
    ...mockFileData,
    ...data,
  };
}
