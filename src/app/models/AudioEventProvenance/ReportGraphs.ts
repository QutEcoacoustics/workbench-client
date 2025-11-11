import { Param } from "@interfaces/apiInterfaces";
import { CoverageGraphData } from "@shared/charts/coverage-plot/coverage-plot.component";
import { SpeciesAccumulationGraphData } from "@shared/charts/species-accumulation-curve/species-accumulation-curve.component";
import { SpeciesCompositionGraphData } from "@shared/charts/species-composition/species-composition.component";
import { SpeciesTimeSeriesGraphData } from "@shared/charts/species-time-series/species-time-series.component";

export interface IEventSummaryGraphs {
  accumulationData: SpeciesAccumulationGraphData[];
  speciesCompositionData: SpeciesCompositionGraphData[];
  speciesTimeSeriesData: SpeciesTimeSeriesGraphData[];
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
