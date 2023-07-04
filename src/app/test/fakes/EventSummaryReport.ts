import {
  IAnalysisCoverageGraphData,
  IEventSummaryReport,
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
    eventGroups: [
      {
        provenanceId: modelData.datatype.number(),
        tagId: 2883,
        detections: 2112,
        bucketsWithDetections: 123,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
      {
        provenanceId: modelData.datatype.number(),
        tagId: 2883,
        detections: 323,
        bucketsWithDetections: 2,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
      {
        provenanceId: modelData.datatype.number(),
        tagId: 2883,
        detections: 1233,
        bucketsWithDetections: 22,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
      {
        provenanceId: modelData.datatype.number(),
        tagId: 1950,
        detections: 13213523,
        bucketsWithDetections: 2411,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
      {
        provenanceId: modelData.datatype.number(),
        tagId: 1831,
        detections: 321,
        bucketsWithDetections: 223,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
      {
        provenanceId: modelData.datatype.number(),
        tagId: 1831,
        detections: 213,
        bucketsWithDetections: 211,
        bucketsWithInterference: [],
        score: {
          histogram: modelData.randomArray<number>(30, 30, () => modelData.percentage()),
          standardDeviation: modelData.percentage(),
          mean: modelData.percentage(),
          min: modelData.percentage(),
          max: modelData.percentage(),
        },
      },
    ],
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
      coverageData: {
        analysisCoverage: [
          { startDate: "2020-10-10", endDate: "2020-10-11" },
          { startDate: "2020-10-12", endDate: "2020-10-15" },
          { startDate: "2020-10-19", endDate: "2020-10-23" },
          { startDate: "2020-10-26", endDate: "2020-11-01" },
          { startDate: "2020-11-10", endDate: "2020-12-01" },
          { startDate: "2020-12-01", endDate: "2020-12-28" },
          { startDate: "2021-01-01", endDate: "2021-04-11" },
          { startDate: "2021-08-10", endDate: "2021-10-11" }
        ],
        recordingCoverage: [
          { startDate: "2020-10-10", endDate: "2020-10-11" },
          { startDate: "2020-10-19", endDate: "2020-10-23" },
          { startDate: "2020-12-01", endDate: "2020-12-28" },
          { startDate: "2021-01-01", endDate: "2021-04-11" },
          { startDate: "2021-08-10", endDate: "2021-10-11" }
        ]
      },
      analysisConfidenceData: modelData.randomArray<IAnalysisCoverageGraphData>(
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
