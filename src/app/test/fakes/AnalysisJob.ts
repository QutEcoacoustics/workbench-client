import { Id } from "@interfaces/apiInterfaces";
import { AnalysisJobStatus, IAnalysisJob } from "@models/AnalysisJob";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJob(id?: Id): IAnalysisJob {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    annotationName: modelData.param(),
    description: modelData.description(),
    scriptId: modelData.id(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
    savedSearchId: modelData.id(),
    startedAt: modelData.timestamp(),
    overallStatus: modelData.random.arrayElement<AnalysisJobStatus>([
      "before_save",
      "new",
      "preparing",
      "processing",
      "suspended",
      "completed",
    ]),
    overallStatusModifiedAt: modelData.timestamp(),
    overallProgress: {
      queued: 1,
      working: 0,
      success: 0,
      failed: 0,
      total: 1,
    },
    overallProgressModifiedAt: modelData.timestamp(),
    overallCount: modelData.random.number(100),
    overallDurationSeconds: modelData.random.arrayElement([15, 30, 60]),
    overallDataLengthBytes: modelData.random.arrayElement([256, 512, 1024]),
    customSettings: modelData.randomObject(0, 5),
  };
}
