import { IAudioEventImport } from "@models/AudioEventImport";
import { modelData } from "@test/helpers/faker";
import { generateImportedAudioEvent } from "./ImportedAudioEvent";

export function generateAudioEventImport(
  data?: Partial<IAudioEventImport>
): Required<IAudioEventImport> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    importedEvents: modelData.randomArray(5, 20, () =>
      generateImportedAudioEvent()
    ),
    analysisJobId: modelData.id(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
