import { SHALLOW_REGION, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id, Ids, Param } from "@interfaces/apiInterfaces";
import { EventSummaryReportParameters } from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { AbstractModel } from "./AbstractModel";
import { hasMany } from "./AssociationDecorators";
import { bawCollection, bawDateTime } from "./AttributeDecorators";
import { Site } from "./Site";
import { Region } from "./Region";
import { EventGroup } from "./EventGroup";

export interface IAudioEventSummaryReportStatistics {
  totalSearchSpan: number;
  audioCoverageOverSpan: number;
  analysisCoverageOverSpan: number;
  countOfRecordingsAnalyzed: number;
  coverageStartDay: DateTimeTimezone | string;
  coverageEndDay: DateTimeTimezone | string;
}

export interface IEventScore {
  histogram: number[];
  standardDeviation: number;
  mean: number;
  min: number;
  max: number;
}

export interface IReportEvent {
  name: Param;
  value: number;
}

export interface IAccumulationGraphData {
  date: Param;
  count: number;
  error: number;
}

export interface ISpeciesCompositionGraphData {
  date: Param;
  tagId: Id;
  ratio: number;
}

export interface IAnalysisCoverageGraphData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}

export interface ITimeSeriesGraph {
  analysisCoverage: IDateRange[];
  recordingCoverage: IDateRange[];
}

export interface IDateRange {
  startDate: Param;
  endDate: Param;
}

export interface IEventSummaryGraphs {
  accumulationData: IAccumulationGraphData[];
  speciesCompositionData: ISpeciesCompositionGraphData[];
  analysisConfidenceData: IAnalysisCoverageGraphData[];
  coverageData: ITimeSeriesGraph;
}

export interface IEventSummaryReport {
  id?: Id;
  name: Param;
  generatedDate: DateTimeTimezone | string;
  statistics: IAudioEventSummaryReportStatistics;
  eventGroups: EventGroup[];
  siteIds: Id[] | Ids;
  regionIds: Id[] | Ids;
  tagIds: Id[] | Ids;
  provenanceIds: Id[] | Ids;
  graphs: IEventSummaryGraphs;
}

export class EventSummaryReport
  extends AbstractModel<IEventSummaryReport>
  implements IEventSummaryReport
{
  public readonly kind = "AudioEventSummaryReport";
  public readonly id?: Id;
  public readonly name: Param;
  @bawDateTime()
  public readonly generatedDate: DateTimeTimezone | string;
  public readonly statistics: IAudioEventSummaryReportStatistics;
  public readonly eventGroups: EventGroup[];
  @bawCollection()
  public readonly siteIds: Ids;
  @bawCollection()
  public readonly regionIds: Ids;
  public readonly graphs: IEventSummaryGraphs;
  public readonly timeSeriesGraph: ITimeSeriesGraph[];
  @bawCollection()
  public readonly tagIds: Ids;
  @bawCollection()
  public readonly provenanceIds: Ids;
  public readonly generationParameters?: EventSummaryReportParameters;

  // associations
  @hasMany<EventSummaryReport, Region>(SHALLOW_REGION, "regionIds")
  public regions?: Region[];
  @hasMany<EventSummaryReport, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
