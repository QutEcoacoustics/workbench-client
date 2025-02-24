import { IAudioEventImport } from "@models/AudioEventImport";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventImport(
  data?: Partial<IAudioEventImport>
): Required<IAudioEventImport> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    analysisJobId: modelData.id(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
