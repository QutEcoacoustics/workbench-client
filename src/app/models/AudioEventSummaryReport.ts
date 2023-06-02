import { DateTimeTimezone, Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime } from "./AttributeDecorators";

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
  binsWithInterference?: IInterferenceEvent[];
  score: IEventScore;
}

export interface IEventScore {
  histogram: number[];
  standardDeviation: number;
  mean: number;
  min: number;
  max: number;
}

export interface IInterferenceEvent {
  name: Param;
  value: number;
}

export interface IAccumulationData {
  date: Param;
  count: number;
  error: number;
}

export interface ISpeciesCompositionData {
  date: Param;
  values: {
    tagId: Id;
    ratio: number;
  }[]
}

export interface IAnalysisCoverageData {
  date: Param;
  audioCoverage: number;
  analysisCoverage: number;
}

export interface IGraphs {
  accumulationData: IAccumulationData[];
  speciesCompositionData: ISpeciesCompositionData[];
  analysisCoverageData: IAnalysisCoverageData[];
}

export interface IAudioEventSummaryReport {
  id?: Id;
  name: Param;
  generatedDate: DateTimeTimezone | string;
  statistics: IAudioEventSummaryReportStatistics;
  eventGroups: IEventGroup[];
  locations: Id[];
  graphs: IGraphs;
}

export class AudioEventSummaryReport extends AbstractModel implements IAudioEventSummaryReport {
  public readonly kind = "AudioEventSummaryReport";
  public readonly id?: Id;
  public readonly name: Param;
  @bawDateTime()
  public readonly generatedDate: DateTimeTimezone | string;
  public readonly statistics: IAudioEventSummaryReportStatistics;
  public readonly eventGroups: IEventGroup[];
  public readonly locations: Id[];
  public readonly graphs: IGraphs;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
