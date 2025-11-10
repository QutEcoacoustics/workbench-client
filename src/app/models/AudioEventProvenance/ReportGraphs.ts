import { Param } from "@interfaces/apiInterfaces";
import { CoverageGraphData } from "@shared/charts/coverage-plot/coverage-plot.component";
import { SpeciesAccumulationGraphData } from "@shared/charts/species-accumulation-curve/species-accumulation-curve.component";
import { SpeciesCompositionGraphData } from "@shared/charts/species-composition/species-composition.component";

export interface IEventSummaryGraphs {
  accumulationData: SpeciesAccumulationGraphData[];
  speciesCompositionData: SpeciesCompositionGraphData[];
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
