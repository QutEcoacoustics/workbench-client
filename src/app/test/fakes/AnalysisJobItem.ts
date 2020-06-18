import { Id } from "@interfaces/apiInterfaces";
import {
  AnalysisJobItemStatus,
  IAnalysisJobItem,
} from "@models/AnalysisJobItem";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJobItem(id?: Id): IAnalysisJobItem {
  return {
    id: modelData.id(id),
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    queueId: modelData.random.uuid(),
    status: modelData.random.arrayElement<AnalysisJobItemStatus>([
      "successful",
      "new",
      "queued",
      "working",
      "failed",
      "timed_out",
      "cancelling",
      "cancelled",
    ]),
    createdAt: modelData.timestamp(),
    queuedAt: modelData.timestamp(),
    workStartedAt: modelData.timestamp(),
    completedAt: modelData.timestamp(),
    cancelStartedAt: modelData.timestamp(),
  };
}
