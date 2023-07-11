import {
  IAccumulationGraphData,
  IAnalysisCoverageGraphData,
  IDateRange,
  IEventGroup,
  IEventSummaryReport,
  ISpeciesCompositionGraphData,
} from "@models/EventSummaryReport";
import { modelData } from "@test/helpers/faker";

export function generateEventSummaryReport(
  data?: Partial<IEventSummaryReport>
): Required<IEventSummaryReport> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    generatedDate: modelData.date.recent().toISOString(),
    statistics: {
      totalSearchSpan: modelData.datatype.number(),
      audioCoverageOverSpan: modelData.datatype.number(),
      analysisCoverageOverSpan: modelData.datatype.number(),
      countOfRecordingsAnalyzed: modelData.datatype.number(),
      coverageStartDay: modelData.date.recent().toISOString(),
      coverageEndDay: modelData.date.recent().toISOString(),
    },
    eventGroups: modelData.randomArray<IEventGroup>(10, 20, () =>
      Object({
        provenanceId: modelData.id(),
        tagId: modelData.id(),
        detections: modelData.datatype.number(),
        bucketsWithDetections: modelData.datatype.number(),
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(10, 20, () =>
            modelData.percentage()
          ),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      })
    ),
    siteIds: modelData.ids(),
    graphs: {
      accumulationData: modelData.randomArray<IAccumulationGraphData>(10, 20, () =>
        Object({
          date: modelData.date.soon(),
          count: modelData.datatype.number(),
          error: modelData.percentage()
        })
      ),
      speciesCompositionData: modelData.randomArray<ISpeciesCompositionGraphData>(10, 20, () =>
        Object({
          date: modelData.date.soon(),
          tagId: modelData.datatype.number(),
          ratio: modelData.percentage()
        })
      ),
      coverageData: {
        recordingCoverage: modelData.randomArray<IDateRange>(10, 20, () =>
          Object({
            startDate: modelData.date.past(),
            endDate: modelData.date.soon(),
          })
        ),
        analysisCoverage: modelData.randomArray<IDateRange>(10, 20, () =>
          Object({
            startDate: modelData.date.past(),
            endDate: modelData.date.soon(),
          })
        ),
      },
      analysisConfidenceData: modelData.randomArray<IAnalysisCoverageGraphData>(
        0,
        10,
        () =>
          Object({
            date: modelData.date.recent().toISOString(),
            audioCoverage: modelData.percentage(),
            analysisCoverage: modelData.percentage(),
          })
      ),
    },
    ...data,
  };
}
