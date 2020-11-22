import { Id } from "@interfaces/apiInterfaces";
import { IAudioEvent } from "@models/AudioEvent";
import { generateTagging } from "@test/fakes/Tagging";
import { modelData } from "@test/helpers/faker";

export function generateAudioEvent(id?: Id): Required<IAudioEvent> {
  const [startTimeSeconds, endTimeSeconds] = modelData.startEndSeconds();
  const [lowFrequencyHertz, highFrequencyHertz] = modelData.startEndArray(
    modelData.defaults.sampleRateHertz
  );

  return {
    id: modelData.id(id),
    audioRecordingId: modelData.id(),
    startTimeSeconds,
    endTimeSeconds,
    lowFrequencyHertz,
    highFrequencyHertz,
    taggings: modelData.randomArray(0, 5, (i) => generateTagging(i)),
    isReference: modelData.boolean(),
    ...modelData.model.generateAllUsers(),
  };
}
