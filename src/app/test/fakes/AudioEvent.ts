import { IAudioEvent } from "@models/AudioEvent";
import { generateTagging } from "@test/fakes/Tagging";
import { modelData } from "@test/helpers/faker";

export function generateAudioEvent(
  data?: Partial<IAudioEvent>
): Required<IAudioEvent> {
  const [startTimeSeconds, endTimeSeconds] = modelData.startEndSeconds();
  const [lowFrequencyHertz, highFrequencyHertz] = modelData.startEndArray(
    modelData.defaults.sampleRateHertz
  );

  return {
    id: modelData.id(),
    audioRecordingId: modelData.id(),
    startTimeSeconds,
    endTimeSeconds,
    lowFrequencyHertz,
    highFrequencyHertz,
    taggings: modelData.randomArray(0, 5, (id) => generateTagging({ id })),
    isReference: modelData.bool(),
    provenanceId: modelData.id(),
    channel: modelData.datatype.number({ min: 1, max: 3 }),
    score: modelData.datatype.number({ min: 0, max: 1 }),
    audioEventImportFileId: modelData.id(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
