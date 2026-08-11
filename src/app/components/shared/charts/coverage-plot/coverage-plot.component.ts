import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisCoverageItem, AudioRecordingCoverageItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import { DateTime } from "luxon";
import chartSchema from "./coveragePlot.schema.json";

interface IDateRange {
  startDate: Param;
  endDate: Param;
}

export interface CoverageGraphData {
  failedAnalysisCoverage: IDateRange[];
  analysisCoverage: IDateRange[];
  missingAnalysisCoverage: IDateRange[];
  recordingCoverage: IDateRange[];
}

@Component({
  selector: "baw-coverage-plot",
  template: `
    <baw-chart #chart [spec]="chartSchema" [datasets]="data()" />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoveragePlotComponent {
  public readonly recordingCoverage = input.required<AudioRecordingCoverageItem[]>();
  public readonly analysisCoverage = input.required<AnalysisCoverageItem[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly data = computed<CoverageGraphData>(() => {
    const recordingCoverage = this.recordingCoverage();
    const analysisCoverage = this.analysisCoverage();

    const recordingBySite = groupCoverageBySite(recordingCoverage);
    const analysisBySite = groupCoverageBySite(analysisCoverage);

    return {
      recordingCoverage: recordingCoverage
        .map((item) => coverageRangeToDateRange(extractCoverageRange(item)))
        .filter((item): item is IDateRange => item !== null),
      analysisCoverage: analysisCoverage
        .filter((item) => item.result === "success")
        .map((item) => coverageRangeToDateRange(extractCoverageRange(item)))
        .filter((item): item is IDateRange => item !== null),
      failedAnalysisCoverage: analysisCoverage
        .filter((item) => item.result !== "success")
        .map((item) => coverageRangeToDateRange(extractCoverageRange(item)))
        .filter((item): item is IDateRange => item !== null),
      missingAnalysisCoverage: Object.entries(recordingBySite).flatMap(
        ([siteId, coverage]) =>
          subtractRanges(coverage, analysisBySite[siteId] ?? [])
            .map(coverageRangeToDateRange)
            .filter((item): item is IDateRange => item !== null),
      ),
    };
  });

  protected readonly chartSchema = Map(chartSchema);
}

type CoverageRangeValue = string | Date | DateTime;
type CoverageRange = [string, string];

interface CoverageRangeLike {
  range?: [CoverageRangeValue, CoverageRangeValue];
  coverage?: [CoverageRangeValue, CoverageRangeValue];
}

function extractCoverageRange(
  row: CoverageRangeLike | undefined,
): CoverageRange | null {
  if (!row) {
    return null;
  }

  const range = row.range ?? row.coverage;
  if (!range) {
    return null;
  }

  return [toIsoString(range[0]), toIsoString(range[1])];
}

function toIsoString(value: CoverageRangeValue): string {
  if (DateTime.isDateTime(value)) {
    return value.toISO() ?? "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function coverageRangeToDateRange(range: CoverageRange | null): IDateRange | null {
  if (!range) {
    return null;
  }

  return {
    startDate: range[0],
    endDate: range[1],
  };
}

function groupCoverageBySite<
  T extends { siteId: number } & CoverageRangeLike,
>(rows: T[]): Record<string, CoverageRange[]> {
  return rows.reduce<Record<string, CoverageRange[]>>((grouped, row) => {
    const siteId = row.siteId.toString();
    const range = extractCoverageRange(row);
    if (!range) {
      return grouped;
    }

    grouped[siteId] ??= [];
    grouped[siteId].push(range);
    return grouped;
  }, {});
}

function subtractRanges(
  source: CoverageRange[],
  subtract: CoverageRange[],
): CoverageRange[] {
  const sortedSubtract = [...subtract].sort((left, right) =>
    left[0].localeCompare(right[0]),
  );

  return source.flatMap((range) => {
    let cursor = range[0];
    const missing: CoverageRange[] = [];

    sortedSubtract.forEach(([subtractStart, subtractEnd]) => {
      if (subtractEnd <= cursor || subtractStart >= range[1]) {
        return;
      }

      if (subtractStart > cursor) {
        missing.push([cursor, subtractStart]);
      }

      if (subtractEnd > cursor) {
        cursor = subtractEnd;
      }
    });

    if (cursor < range[1]) {
      missing.push([cursor, range[1]]);
    }

    return missing;
  });
}
