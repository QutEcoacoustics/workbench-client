import {
  IAccumulationGraphData,
  IAnalysisCoverageGraphData,
  IEventSummaryReport,
  IEventGroup,
  IReportEvent,
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
    eventGroups: modelData.randomArray<IEventGroup>(1, 10, () =>
      Object({
        provenanceId: modelData.id(),
        tagId: modelData.id(),
        detections: modelData.datatype.number(),
        binsWithDetections: modelData.datatype.number(),
        binsWithInterference: modelData.randomArray<IReportEvent>(
          0,
          10,
          () =>
            Object({
              name: modelData.param(),
              value: modelData.datatype.number(),
            })
        ),
        score: {
          histogram: modelData.datatype.array(
            modelData.datatype.number()
          ),
          standardDeviation: modelData.datatype.number(),
          mean: modelData.datatype.number(),
          min: modelData.datatype.number(),
          max: modelData.datatype.number(),
        },
      })
    ),
    siteIds: modelData.ids(),
    graphs: {
      accumulationData: modelData.randomArray<IAccumulationGraphData>(1, 10, () =>
        Object({
          date: modelData.date.recent().toISOString(),
          count: modelData.datatype.number(),
          error: modelData.datatype.number(),
        })
      ),
      speciesCompositionData: modelData.randomArray<ISpeciesCompositionGraphData>(
        0,
        10,
        () =>
          Object({
            date: modelData.date.recent().toISOString(),
            values: modelData.randomArray<number>(1, 10, () =>
              Object({
                tagId: modelData.id(),
                ratio: modelData.datatype.number(),
              })
            ),
          })
      ),
      analysisCoverageData: modelData.randomArray<IAnalysisCoverageGraphData>(
        0,
        10,
        () =>
          Object({
            date: modelData.date.recent().toISOString(),
            audioCoverage: modelData.datatype.number(),
            analysisCoverage: modelData.datatype.number(),
          })
      ),
    },
    ...data,
  };
}
