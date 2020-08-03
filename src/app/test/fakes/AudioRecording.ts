import { Id } from "@interfaces/apiInterfaces";
import { AudioRecordingStatus, IAudioRecording } from "@models/AudioRecording";
import { modelData } from "@test/helpers/faker";

export function generateAudioRecording(id?: Id): IAudioRecording {
  const bitRateBps = modelData.random.arrayElement(
    modelData.defaults.bitRateBps
  );
  const durationSeconds = modelData.random.arrayElement([
    30,
    60,
    1800,
    3600,
    7200,
    21600,
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

  return {
    id: modelData.id(id),
    uuid: modelData.uuid(),
    uploaderId: modelData.id(),
    recordedDate: modelData.timestamp(),
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
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
    originalFileName: modelData.system.fileName(".mpg", "audio"),
    recordedUtcOffset: modelData.offset(),
  };
}
