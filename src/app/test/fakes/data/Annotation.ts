import { IAnnotation } from "@models/data/Annotation";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioEvent } from "../AudioEvent";
import { generateTag } from "../Tag";
import { generateAudioRecording } from "../AudioRecording";

export function generateAnnotation(
  data?: Partial<IAnnotation>
): Required<IAnnotation> {
  return {
    ...generateAudioEvent(),
    audioRecording: new AudioRecording(generateAudioRecording()),
    tags: modelData.randomArray(0, 10, () => new Tag(generateTag())),
    ...data,
  };
}
