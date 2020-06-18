import { Id } from "@interfaces/apiInterfaces";
import {} from "@models/AnalysisJobItem";
import { AudioRecordingStatus, IAudioRecording } from "@models/AudioRecording";
import { modelData } from "@test/helpers/faker";

export function generateAudioRecording(id?: Id): IAudioRecording {
  return {
    id: modelData.id(id),
    uuid: modelData.uuid(),
    uploaderId: modelData.id(),
    recordedDate: modelData.timestamp(),
    siteId: modelData.id(),
    durationSeconds: modelData.id(),
    sampleRateHertz: modelData.id(),
    bitRateBps: 22050, // TODO Replace with list of possibilities
    mediaType: "audio/mpeg", // TODO Replace with list of possibilities
    dataLengthBytes: 3800, // TODO Replace with list of possibilities
    fileHash: "SHA: 2346ad27d7568ba9896f1b7da6b5991251debdf2",
    status: modelData.random.arrayElement<AudioRecordingStatus>([
      "new",
      "uploading",
      "to_check",
      "ready",
      "corrupt",
      "aborted",
    ]),
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
