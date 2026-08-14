import { AudioRecordingStatus, IAudioRecording } from "@models/AudioRecording";
import { modelData } from "@test/helpers/faker";
import { DateTime } from "luxon";

export function generateAudioRecording(
  data?: Partial<IAudioRecording>
): Required<IAudioRecording> {
  const bitRateBps = modelData.helpers.arrayElement(
    modelData.defaults.bitRateBps
  );
  const durationSeconds = modelData.helpers.arrayElement([
    30, 60, 1800, 3600, 7200, 21600,
  ]);
  const mediaTypes = ["audio/mpeg", "audio/flac", "audio/wave"];
  const statuses: AudioRecordingStatus[] = [
    "new",
    "uploading",
    "toCheck",
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
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    recordedDate: recordedDate.toISO(),
    siteId: modelData.id(),
    durationSeconds,
    sampleRateHertz: modelData.helpers.arrayElement(
      modelData.defaults.sampleRateHertz
    ),
    channels: modelData.helpers.arrayElement([1, 2, 4, 6]),
    bitRateBps,
    mediaType: modelData.helpers.arrayElement(mediaTypes),
    dataLengthBytes: durationSeconds * bitRateBps,
    fileHash: modelData.hash(),
    status: modelData.helpers.arrayElement(statuses),
    notes: modelData.notes(),
    originalFileName: modelData.system.commonFileName(".mpg"),
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    recordedDateTimezone: recordedDate.zoneName,
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}
