import { Id, Param } from "@interfaces/apiInterfaces";
import { Tag } from "@models/Tag";
import { CoverageGraphData } from "@shared/charts/coverage-plot/coverage-plot.component";
import { SpeciesAccumulationGraphData } from "@shared/charts/species-accumulation-curve/species-accumulation-curve.component";

export interface IEventSummaryGraphs {
  accumulationData: SpeciesAccumulationGraphData[];
  speciesCompositionData: CompositionSeriesData[];
  analysisConfidenceData: AnalysisCoverageGraphData[];
  coverageData: CoverageGraphData;
}

export interface IDateRange {
  startDate: Param;
  endDate: Param;
}

interface AnalysisCoverageGraphData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}

interface CompositionSeriesData {
  date: Param;
  tagId: Id<Tag>;
  ratio: number;
  count: number;
}
