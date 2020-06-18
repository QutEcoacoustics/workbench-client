import { Id } from "@interfaces/apiInterfaces";
import { IAudioEvent } from "@models/AudioEvent";
import { modelData } from "@test/helpers/faker";

export function generateAudioEvent(id?: Id): IAudioEvent {
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
    isReference: modelData.boolean(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
  };
}
