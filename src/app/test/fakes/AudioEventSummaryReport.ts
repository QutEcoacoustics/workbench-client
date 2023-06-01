import { IAudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventSummaryReport(
  data?: Partial<IAudioEventSummaryReport>
): Required<IAudioEventSummaryReport> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    statistics: {
      totalSearchSpan: modelData.datatype.number(),
      audioCoverageOverSpan: modelData.datatype.number(),
      analysisCoverageOverSpan: modelData.datatype.number(),
      countOfRecordingsAnalyzed: modelData.datatype.number(),
      coverageStartDay: modelData.date.recent().toISOString(),
      coverageEndDay: modelData.date.recent().toISOString(),
    },
    eventGroups: [
      {
        provenanceId: modelData.id(),
        tagId: modelData.id(),
        detections: modelData.datatype.number(),
        binsWithDetections: modelData.datatype.number(),
        binsWithInterference: [
          {
            name: modelData.param(),
            value: modelData.datatype.number(),
          },
        ],
        score: {
          histogram: modelData.datatype.array(modelData.datatype.number()) as number[], // TODO: REMOVE THIS TYPE CAST BEFORE REVIEW
          standardDeviation: modelData.datatype.number(),
          mean: modelData.datatype.number(),
          min: modelData.datatype.number(),
          max: modelData.datatype.number(),
        },
      },
    ],
    ...data,
  };
}
