import { AudioRecordingStatus, IAudioRecording } from "@models/AudioRecording";
import { modelData } from "@test/helpers/faker";
import { DateTime } from "luxon";

export function generateAudioRecording(
  data?: Partial<IAudioRecording>
): Required<IAudioRecording> {
  const bitRateBps = modelData.random.arrayElement(
    modelData.defaults.bitRateBps
  );
  const durationSeconds = modelData.random.arrayElement([
    30, 60, 1800, 3600, 7200, 21600,
  ]);
  const mediaTypes = ["audio/mpeg", "audio/flac", "audio/wave"];
  const statuses: AudioRecordingStatus[] = [
    "new",
    "uploading",
    "to_check",
    "ready",
    "corrupt",
    "aborted",
  ];

  const recordedDate = DateTime.fromISO(modelData.timestamp(), {
    setZone: true,
  });

  return {
    id: modelData.id(),
    uuid: modelData.uuid(),
    uploaderId: modelData.id(),
    recordedDate: recordedDate.toISO(),
    siteId: modelData.id(),
    durationSeconds,
    sampleRateHertz: modelData.random.arrayElement(
      modelData.defaults.sampleRateHertz
    ),
    channels: modelData.random.arrayElement([1, 2, 4, 6]),
    bitRateBps,
    mediaType: modelData.random.arrayElement(mediaTypes),
    dataLengthBytes: durationSeconds * bitRateBps,
    fileHash: modelData.hash(),
    status: modelData.random.arrayElement(statuses),
    notes: modelData.notes(),
    originalFileName: modelData.system.commonFileName(".mpg"),
    recordedDateTimezone: recordedDate.zoneName,
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
