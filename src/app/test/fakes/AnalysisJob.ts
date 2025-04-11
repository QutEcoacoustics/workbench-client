import { AnalysisJobStatus, IAnalysisJob, OverallProgress } from "@models/AnalysisJob";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJob(data?: Partial<IAnalysisJob>): Required<IAnalysisJob> {
  const overallDurationSeconds = modelData.datatype.number(3.154e7); // 1 year
  const overallDataLengthBytes = overallDurationSeconds * 22050 * 2; // duration seconds * sample rate * two bytes per sample
  const statuses = [
    "beforeSave",
    "new",
    "preparing",
    "processing",
    "suspended",
    "completed",
  ] satisfies AnalysisJobStatus[];

  return {
    id: modelData.id(),
    name: modelData.param(),
    scriptIds: modelData.ids(),
    audioEventImportIds: modelData.ids(),
    projectId: modelData.id(),
    startedAt: modelData.timestamp(),
    ongoing: modelData.bool(),
    systemJob: modelData.bool(),
    amendCount: modelData.datatype.number(),
    resumeCount: modelData.datatype.number(),
    retryCount: modelData.datatype.number(),
    suspendCount: modelData.datatype.number(),
    filter: {}, // TODO: this should be randomly generated
    overallStatus: modelData.helpers.arrayElement(statuses),
    overallStatusModifiedAt: modelData.timestamp(),
    overallProgress: generateOverallProgress(),
    overallProgressModifiedAt: modelData.timestamp(),
    overallCount: modelData.datatype.number(1000),
    overallDurationSeconds,
    overallDataLengthBytes,
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}

// I have decided not to include this fake generator in the modelData object
// because we only use it once inside the generateAnalysisJob() function
function generateOverallProgress(): Required<OverallProgress> {
  return {
    statusNewCount: modelData.datatype.number(),

    resultSuccessCount: modelData.datatype.number(),
    resultFailedCount: modelData.datatype.number(),
    resultKilledCount: modelData.datatype.number(),
    resultCancelledCount: modelData.datatype.number(),
    resultEmptyCount: modelData.datatype.number(),

    statusQueuedCount: modelData.datatype.number(),
    statusWorkingCount: modelData.datatype.number(),
    statusFinishedCount: modelData.datatype.number(),

    transitionQueueCount: modelData.datatype.number(),
    transitionFinishedCount: modelData.datatype.number(),
    transitionRetryCount: modelData.datatype.number(),
    transitionCancelCount: modelData.datatype.number(),
    transitionEmptyCount: modelData.datatype.number(),
  };
}
