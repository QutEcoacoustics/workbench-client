import {
  IAnalysisCoverageGraphData,
  IEventSummaryReport,
  IEventGroup,
  IReportEvent,
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
          histogram: modelData.randomArray<number>(10, 20, () => modelData.datatype.number()),
          standardDeviation: modelData.datatype.number(),
          mean: modelData.datatype.number(),
          min: modelData.datatype.number(),
          max: modelData.datatype.number(),
        },
      })
    ),
    siteIds: modelData.ids(),
    // while not truely random, the use of hard coded graph data was used to ensure lifelike graphs during presentations
    graphs: {
      accumulationData: [
        { date: "22-05-2023", count: 5, errorPositive: 5 + 0.5, errorNegative: 5 - 0.5 },
        { date: "23-05-2023", count: 3, errorPositive: 3 + 0.5, errorNegative: 3 - 0.5 },
        { date: "24-05-2023", count: 4, errorPositive: 4 + 0.5, errorNegative: 4 - 0.5 },
        { date: "25-05-2023", count: 2, errorPositive: 2 + 0.5, errorNegative: 2 - 0.5 },
        { date: "26-05-2023", count: 6, errorPositive: 6 + 0.5, errorNegative: 6 - 0.5 },
      ],
      speciesCompositionData: [
        { date: "22-05-2023", tagId: 1, ratio: 0.55 },
        { date: "22-05-2023", tagId: 39, ratio: 0.30 },
        { date: "22-05-2023", tagId: 277, ratio: 0.15 },
        { date: "23-05-2023", tagId: 1, ratio: 0.45 },
        { date: "23-05-2023", tagId: 39, ratio: 0.20 },
        { date: "23-05-2023", tagId: 277, ratio: 0.35 },
        { date: "24-05-2023", tagId: 1, ratio: 0.05 },
        { date: "24-05-2023", tagId: 39, ratio: 0.25 },
        { date: "24-05-2023", tagId: 277, ratio: 0.7 },
        { date: "25-05-2023", tagId: 1, ratio: 0.5 },
        { date: "25-05-2023", tagId: 39, ratio: 0.2 },
        { date: "25-05-2023", tagId: 277, ratio: 0.3 },
        { date: "26-05-2023", tagId: 1, ratio: 0.25 },
        { date: "26-05-2023", tagId: 39, ratio: 0.40 },
        { date: "26-05-2023", tagId: 277, ratio: 0.35 }
      ],
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
