import { IImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { modelData } from "@test/helpers/faker";
import { generateAudioEvent } from "./AudioEvent";
import { generateTag } from "./Tag";

export function generateImportedAudioEvent(
  data?: Partial<IImportedAudioEvent>
): Required<IImportedAudioEvent> {
  return {
    ...generateAudioEvent(data),
    errors: [],
    tags: modelData.randomArray(0, 10, () => generateTag()),
    ...data,
  };
}
