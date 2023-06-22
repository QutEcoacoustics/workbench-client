import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id, Ids, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { hasMany } from "./AssociationDecorators";
import { bawCollection, bawDateTime } from "./AttributeDecorators";
import { Site } from "./Site";

export interface IAudioEventSummaryReportStatistics {
  totalSearchSpan: number;
  audioCoverageOverSpan: number;
  analysisCoverageOverSpan: number;
  countOfRecordingsAnalyzed: number;
  coverageStartDay: DateTimeTimezone | string;
  coverageEndDay: DateTimeTimezone | string;
}

export interface IEventGroup {
  provenanceId: Id;
  tagId: Id;
  detections: number;
  binsWithDetections: number;
  binsWithInterference?: IReportEvent[];
  score: IEventScore;
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
  values: {
    tagId: Id;
    ratio: number;
  }[];
}

export interface IAnalysisCoverageGraphData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}

export interface IEventSummaryGraphs {
  accumulationData: IAccumulationGraphData[];
  speciesCompositionData: ISpeciesCompositionGraphData[];
  analysisCoverageData: IAnalysisCoverageGraphData[];
}

export interface IEventSummaryReport {
  id?: Id;
  name: Param;
  generatedDate: DateTimeTimezone | string;
  statistics: IAudioEventSummaryReportStatistics;
  eventGroups: IEventGroup[];
  siteIds: Id[] | Ids;
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
  public readonly eventGroups: IEventGroup[];
  @bawCollection()
  public readonly siteIds: Ids;
  public readonly graphs: IEventSummaryGraphs;

  @hasMany<EventSummaryReport, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
