import {
  IStatistics,
  IStatisticsRecent,
  IStatisticsSummary,
} from "@models/Statistics";
import { modelData } from "@test/helpers/faker";

export function generateStatisticsRecent(
  data?: Partial<IStatisticsRecent>
): Required<IStatisticsRecent> {
  return {
    audioEventIds: modelData.ids(),
    audioRecordingIds: modelData.ids(),
    ...data,
  };
}

export function generateStatisticsSummary(
  data?: Partial<IStatisticsSummary>
): Required<IStatisticsSummary> {
  return {
    annotationsRecent: modelData.datatype.number(),
    annotationsTotal: modelData.datatype.number(),
    annotationsTotalDuration: modelData.datatype.number(),
    audioRecordingsRecent: modelData.datatype.number(),
    audioRecordingsTotal: modelData.datatype.number(),
    audioRecordingsTotalDuration: modelData.datatype.number(),
    audioRecordingsTotalSize: modelData.datatype.number(),
    onlineWindowStart: modelData.date.recent().toISOString(),
    projectsTotal: modelData.datatype.number(),
    regionsTotal: modelData.datatype.number(),
    sitesTotal: modelData.datatype.number(),
    tagsAppliedTotal: modelData.datatype.number(),
    tagsAppliedUniqueTotal: modelData.datatype.number(),
    tagsTotal: modelData.datatype.number(),
    usersOnline: modelData.datatype.number(),
    usersTotal: modelData.datatype.number(),
    ...data,
  };
}

export function generateStatistics(
  recent?: Partial<IStatisticsRecent>,
  summary?: Partial<IStatisticsSummary>
): Required<IStatistics> {
  return {
    recent: generateStatisticsRecent(recent),
    summary: generateStatisticsSummary(summary),
  };
}
