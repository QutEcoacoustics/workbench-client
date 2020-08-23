import { Id } from "@interfaces/apiInterfaces";
import { AnalysisJobStatus, IAnalysisJob } from "@models/AnalysisJob";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJob(id?: Id): IAnalysisJob {
  const overallDurationSeconds = modelData.random.number(3.154e7); // 1 year
  const overallDataLengthBytes = overallDurationSeconds * 22050 * 2; // duration seconds * sample rate * two bytes per sample
  const statuses: AnalysisJobStatus[] = [
    "before_save",
    "new",
    "preparing",
    "processing",
    "suspended",
    "completed",
  ];

  return {
    id: modelData.id(id),
    name: modelData.param(),
    annotationName: modelData.param(),
    description: modelData.description(),
    descriptionHtml: modelData.descriptionHtml(),
    scriptId: modelData.id(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
    savedSearchId: modelData.id(),
    startedAt: modelData.timestamp(),
    overallStatus: modelData.random.arrayElement(statuses),
    overallStatusModifiedAt: modelData.timestamp(),
    overallProgress: {
      queued: 1,
      working: 0,
      success: 0,
      failed: 0,
      total: 1,
    },
    overallProgressModifiedAt: modelData.timestamp(),
    overallCount: modelData.random.number(1000),
    overallDurationSeconds,
    overallDataLengthBytes,
    customSettings: modelData.randomObject(0, 5),
  };
}
