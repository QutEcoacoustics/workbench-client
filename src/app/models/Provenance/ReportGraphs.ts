import { Id, Param } from "@interfaces/apiInterfaces";
import { Tag } from "@models/Tag";
import { CoverageGraphData } from "@shared/charts/coverage-plot/coverage-plot.component";
import { TagAccumulationComponent } from "@shared/charts/tag-accumulation/tag-accumulation.component";

export interface IEventSummaryGraphs {
  accumulationData: TagAccumulationComponent[];
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
