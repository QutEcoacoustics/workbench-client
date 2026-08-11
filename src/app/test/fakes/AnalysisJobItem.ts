import {
  AnalysisJobItemStatus,
  AnalysisJobItemResultStatus,
  AnalysisJobItemTransition,
  IAnalysisJobItem,
} from "@models/AnalysisJobItem";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJobItem(
  data?: Partial<IAnalysisJobItem>
): Required<IAnalysisJobItem> {
  const statuses: AnalysisJobItemStatus[] = [
    "new",
    "queued",
    "working",
    "finished",
  ];

  return {
    id: modelData.id(),
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    scriptId: modelData.id(),
    queueId: modelData.datatype.uuid(),
    status: modelData.helpers.arrayElement(statuses),
    createdAt: modelData.timestamp(),
    queuedAt: modelData.timestamp(),
    workStartedAt: modelData.timestamp(),
    finishedAt: modelData.timestamp(),
    error: modelData.datatype.string(),
    attempts: modelData.datatype.number(),
    result: modelData.helpers.arrayElement([
      "success",
      "failed",
      "killed",
      "cancelled",
    ] as AnalysisJobItemResultStatus[]),
    transition: modelData.helpers.arrayElement([
      "queue",
      "cancel",
      "retry",
      "finish",
    ] as AnalysisJobItemTransition[]),
    usedWalltimeSeconds: modelData.datatype.number(),
    usedMemoryBytes: modelData.datatype.number(),
    audioEventImportFileIds: new Set([modelData.id(), modelData.id()]),
    importSuccess: modelData.datatype.boolean(),
    ...data,
  };
}
