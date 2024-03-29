import {
  AnalysisJobItemStatus,
  IAnalysisJobItem,
} from "@models/AnalysisJobItem";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJobItem(
  data?: Partial<IAnalysisJobItem>
): Required<IAnalysisJobItem> {
  const statuses: AnalysisJobItemStatus[] = [
    "successful",
    "new",
    "queued",
    "working",
    "failed",
    "timedOut",
    "cancelling",
    "cancelled",
  ];

  return {
    id: modelData.id(),
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    queueId: modelData.datatype.uuid(),
    status: modelData.helpers.arrayElement(statuses),
    createdAt: modelData.timestamp(),
    queuedAt: modelData.timestamp(),
    workStartedAt: modelData.timestamp(),
    completedAt: modelData.timestamp(),
    cancelStartedAt: modelData.timestamp(),
    ...data,
  };
}
