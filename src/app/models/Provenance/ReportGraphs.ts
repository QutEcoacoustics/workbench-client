import { Id, Param } from "@interfaces/apiInterfaces";

export interface IEventSummaryGraphs {
  accumulationData: IAccumulationGraphData[];
  speciesCompositionData: ISpeciesCompositionGraphData[];
  analysisConfidenceData: IAnalysisCoverageGraphData[];
  coverageData: ITimeSeriesGraph;
}

interface IDateRange {
  startDate: Param;
  endDate: Param;
}

interface ITimeSeriesGraph {
  failedAnalysisCoverage: IDateRange[];
  analysisCoverage: IDateRange[];
  missingAnalysisCoverage: IDateRange[];
  recordingCoverage: IDateRange[];
}

interface IAccumulationGraphData {
  date: Param;
  count: number;
  error: number;
}

interface ISpeciesCompositionGraphData {
  date: Param;
  tagId: Id;
  ratio: number;
}

interface IAnalysisCoverageGraphData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}
