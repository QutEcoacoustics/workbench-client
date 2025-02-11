import { IImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { generateAudioEvent } from "./AudioEvent";

export function generateImportedAudioEvent(
  data?: Partial<IImportedAudioEvent>
): Required<IImportedAudioEvent> {
  return {
    ...generateAudioEvent(data),
    errors: [],
    tags: [],
    ...data,
  };
}
