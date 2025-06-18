import { IAudioEventProvenance } from "@models/AudioEventProvenance";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventProvenance(
  data?: Partial<IAudioEventProvenance>
): Required<IAudioEventProvenance> {
  return {
    id: modelData.id(),
    name: modelData.name.jobTitle(),
    version: modelData.version(),
    description: modelData.description(),
    scoreMinimum: modelData.datatype.number(),
    scoreMaximum: modelData.datatype.number(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
