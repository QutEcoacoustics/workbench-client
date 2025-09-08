import { AudioEvent } from "@models/AudioEvent";
import { ITaggingCorrection } from "@models/data/TaggingCorrection";
import { modelData } from "@test/helpers/faker";
import { generateAudioEvent } from "../AudioEvent";

export function generateTaggingCorrection(
  data?: Partial<ITaggingCorrection>,
): Required<ITaggingCorrection> {
  return {
    audioEvent: new AudioEvent(generateAudioEvent()),
    correctTagId: modelData.id(),
    ...data,
  };
}
