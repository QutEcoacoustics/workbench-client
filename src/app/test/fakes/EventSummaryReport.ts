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
        bucketsWithDetections: modelData.datatype.number(),
        bucketsWithInterference: modelData.randomArray<IReportEvent>(
          0,
          10,
          () =>
            Object({
              name: modelData.param(),
              value: modelData.datatype.number(),
            })
        ),
        // since all these values will be scores from recognizers/provenances, they will be bounded between 0 and 1
        // while not technically percentages, they can be mocked with fake data using a percentage because of the same domain
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      })
    ),
    siteIds: modelData.ids(),
    // while not truely random, the use of hard coded graph data was used to ensure lifelike graphs during presentations
    graphs: {
      accumulationData: [
        { date: "22-05-2023", count: 4, error: 1 },
        { date: "23-05-2023", count: 9, error: 1 },
        { date: "24-05-2023", count: 12, error: 1 },
        { date: "25-05-2023", count: 12, error: 1 },
        { date: "26-05-2023", count: 12, error: 1 },
        { date: "27-05-2023", count: 12, error: 1 },
        { date: "28-05-2023", count: 12, error: 1 },
        { date: "29-05-2023", count: 13, error: 1 },
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
