import { Id, Param } from "@interfaces/apiInterfaces";

export interface EventSummaryGraphs {
  accumulationData: AccumulationGraphData[];
  speciesCompositionData: SpeciesCompositionGraphData[];
  analysisConfidenceData: AnalysisCoverageGraphData[];
  coverageData: TimeSeriesGraph;
}

export interface DateRange {
  startDate: Param;
  endDate: Param;
}

interface TimeSeriesGraph {
  failedAnalysisCoverage: DateRange[];
  analysisCoverage: DateRange[];
  missingAnalysisCoverage: DateRange[];
  recordingCoverage: DateRange[];
}

interface AccumulationGraphData {
  date: Param;
  count: number;
  error: number;
}

interface SpeciesCompositionGraphData {
  date: Param;
  tagId: Id;
  ratio: number;
}

interface AnalysisCoverageGraphData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}
