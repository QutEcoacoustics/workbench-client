import { IAnnotation } from "@models/data/Annotation";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioEvent } from "../AudioEvent";
import { generateTag } from "../Tag";
import { generateAudioRecording } from "../AudioRecording";

export function generateAnnotation(data?: Partial<IAnnotation>): Required<IAnnotation> {
  const audioRecording = data?.audioRecording ?? new AudioRecording(generateAudioRecording());

  const audioEvent = generateAudioEvent({
    audioRecordingId: audioRecording.id,
    startTimeSeconds: modelData.datatype.number({
      min: 0,
      max: audioRecording.durationSeconds - 10,
    }),
    endTimeSeconds: modelData.datatype.number({
      min: audioRecording.durationSeconds - 10,
      max: audioRecording.durationSeconds,
    }),
  });

  const tags = modelData.randomArray(0, 10, () => new Tag(generateTag()));

  return {
    ...audioEvent,
    audioRecording,
    tags,
    ...data,
  };
}
