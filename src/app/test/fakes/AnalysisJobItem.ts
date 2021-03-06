import { Id } from "@interfaces/apiInterfaces";
import {
  AnalysisJobItemStatus,
  IAnalysisJobItem,
} from "@models/AnalysisJobItem";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJobItem(id?: Id): Required<IAnalysisJobItem> {
  const statuses: AnalysisJobItemStatus[] = [
    "successful",
    "new",
    "queued",
    "working",
    "failed",
    "timed_out",
    "cancelling",
    "cancelled",
  ];

  return {
    id: modelData.id(id),
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    queueId: modelData.datatype.uuid(),
    status: modelData.random.arrayElement(statuses),
    createdAt: modelData.timestamp(),
    queuedAt: modelData.timestamp(),
    workStartedAt: modelData.timestamp(),
    completedAt: modelData.timestamp(),
    cancelStartedAt: modelData.timestamp(),
  };
}
