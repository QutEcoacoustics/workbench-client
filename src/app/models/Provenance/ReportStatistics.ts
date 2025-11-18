import { DateTimeTimezone } from "@interfaces/apiInterfaces";

export interface IAudioEventSummaryReportStatistics {
  totalSearchSpan: number;
  audioCoverageOverSpan: number;
  analysisCoverageOverSpan: number;
  countOfRecordingsAnalyzed: number;
  coverageStartDay: DateTimeTimezone | string;
  coverageEndDay: DateTimeTimezone | string;
}
