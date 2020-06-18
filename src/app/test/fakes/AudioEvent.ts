import { Id } from "@interfaces/apiInterfaces";
import { IAudioEvent } from "@models/AudioEvent";
import { modelData } from "@test/helpers/faker";

export function generateAudioEvent(id?: Id): IAudioEvent {
  const hertzRange = [22050, 8000, 44100, 48000];

  return {
    id: modelData.id(id),
    audioRecordingId: modelData.id(),
    startTimeSeconds: modelData.seconds(),
    endTimeSeconds: modelData.seconds(),
    lowFrequencyHertz: modelData.random.arrayElement(hertzRange),
    highFrequencyHertz: modelData.random.arrayElement(hertzRange),
    isReference: modelData.boolean(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
  };
}
