import { Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

interface IAudioEventSummaryReportStatistics {
  totalSearchSpan: number;
  audioCoverageOverSpan: number;
  analysisCoverageOverSpan: number;
  countOfRecordingsAnalyzed: number;
  coverageStartDay: string;
  coverageEndDay: string;
}

interface IEventGroup {
  provenanceId: Id;
  tagId: Id;
  detections: number;
  binsWithDetections: number;
  binsWithInterference?: IInterferenceEvent[];
  score: IEventScore;
}

interface IEventScore {
  histogram: number[];
  standardDeviation: number;
  mean: number;
  min: number;
  max: number;
}

interface IInterferenceEvent {
  name: Param;
  value: number;
}

interface IAccumulationData {
  date: Param;
  count: number;
  error: number;
}

interface ISpeciesCompositionData {
  date: Param;

}

interface IAnalysisCoverageData {
}

export interface IAudioEventSummaryReport {
  id?: Id;
  name: Param;
  statistics: IAudioEventSummaryReportStatistics;
  eventGroups: IEventGroup[];
}

export class AudioEventSummaryReport extends AbstractModel implements IAudioEventSummaryReport {
  public readonly kind = "AudioEventSummaryReport";
  public readonly id?: Id;
  public readonly name: Param;
  public readonly statistics: IAudioEventSummaryReportStatistics;
  public readonly eventGroups: IEventGroup[];

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
