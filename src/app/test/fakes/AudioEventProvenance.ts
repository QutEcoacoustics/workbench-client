import { IAudioEventProvenance } from "@models/AudioEventProvenance";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventProvenance(
  data?: Partial<IAudioEventProvenance>
): Required<IAudioEventProvenance> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    version: modelData.param(),
    description: modelData.description(),
    score: modelData.percentage(),
    ...data,
  };
}
